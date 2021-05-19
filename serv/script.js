const main = document.getElementById('main');
const body = document.getElementById('body');
let nr = 0;

function getIdeasFromServer(){
    fetch('http://localhost:3000/ideas')
    .then(
      function(response) {
        if (response.status !== 200) {
          console.log('Looks like there was a problem. Status Code: ' +
            response.status);
          return;
        }
        response.json().then(function(ideas) {
            printIdeasListPage(ideas);
        });
      }
    )
    .catch(function(err) {
      console.log('Fetch Error :-S', err);
    });    
};

function addIdeaToServer(ob){
    fetch('http://localhost:3000/ideas',{
      method: 'post',
      headers: {
          "Content-type": "application/json;charset=utf-8"
      },
      body: JSON.stringify(ob)
    }).then(function () {
      ob.title.value = '';
      ob.name.value = '';
      ob.price.value = '';
      ob.contact.value = '';
      ob.description.value = '';
      getIdeasFromServer();
    });
}

function createIdea(idea){
    let infoList = document.createElement('ul');
    infoList.className = "info-idea";

    let title = document.createElement('li');
    title.className = "ideaTitle";
    title.textContent = idea.title;

    let name  = document.createElement('li');
    name.className = "sellerName";
    name.textContent = idea.name;

    let contact = document.createElement('li');
    contact.className = "sellerContact";
    contact.textContent = idea.contact;

    let price = document.createElement('li');
    price.className = "ideaPrice";
    price.textContent = idea.price;

    let description = document.createElement('p');
    description.className = "ideaDescription";
    description.textContent = idea.description;

    infoList.appendChild(title);
    infoList.appendChild(name);
    infoList.appendChild(price);
    infoList.appendChild(contact);


    let div = document.createElement('div');
    div.className = "description-container";
    div.appendChild(description);

    let new_idea = document.createElement('article');
    new_idea.className = "idea-container";
    let buy = document.createElement('button');
    buy.innerHTML = "Buy idea";
    buy.className = "buy-idea-button";
    buy.setAttribute("id",idea.id);
    new_idea.appendChild(infoList);
    new_idea.appendChild(div);
    new_idea.appendChild(buy);
    return new_idea;
}

function goToAboutPage(){
    removeNavBar();
    let nav_bar = document.getElementById('nav-bar');
    let nav_item = document.createElement('li');
    nav_item.className = "navigation-item";
    nav_item.setAttribute("id","nav-back-from-about");
    let button = document.createElement('button');
    button.className = "item-button";
    button.setAttribute("id","back-from-about");
    button.innerText = "Back to ideas";
    nav_item.appendChild(button);
    nav_bar.appendChild(nav_item);
    let div = document.createElement('div');
    div.className = 'about-page';
    let title = document.createElement('h3');
    title.className = "about-page-title";
    title.innerText = "About this page";
    let p = document.createElement('p');
    p.className = "about-content";
    p.innerText = "Pagina aceasta este destinata celor care au idei, dar nu au timp de aplicarea lor. Pagina ofera posibilitatea de a cumpara si de a vinde idei pentru publicul interesat. Ai timp, dar n-ai idee de bussiness. Poti naviga acum pe pagina Sell&Buy Ideas fara comisioane la cumparare. Cu un click poti cumpara acum ideea altora, primind astfel dreptul de autor pentru idee.";
    div.appendChild(title);
    div.appendChild(p);
    main.appendChild(div);
    button.addEventListener('click',function(){
      deleteAboutPage();
      setBackNav();
      getIdeasFromServer();
    });
}

function deleteAboutPage(){
    let a = document.getElementById('nav-bar');
    let b = document.getElementById('nav-back-from-about');
    a.removeChild(b);
    main.removeChild(main.firstChild);
}

function setBackNav(){

  let navigation = document.getElementById('nav-bar');
  let nav_sell = document.createElement('li');
  nav_sell.className = "navigation-item";
  nav_sell.setAttribute("id","nav-sell");
  let sell_idea = document.createElement('button');
  sell_idea.className = "item-button";
  sell_idea.innerHTML = "Sell idea";
  sell_idea.setAttribute("id","sell-idea");
  nav_sell.appendChild(sell_idea);
  navigation.appendChild(nav_sell);

  let nav_about = document.createElement('li');
  nav_about.className = "navigation-item";
  nav_about.setAttribute("id","nav-about");
  let about = document.createElement('button');
  about.className = "item-button";
  about.innerHTML = "About";
  about.setAttribute("id","about");
  nav_about.appendChild(about);
  navigation.appendChild(nav_about);

}

function printIdeasListPage(ideas){                                         /// listeaza ideile pe pagina
    for(let i = 0; i < ideas.length; i++){
        let d = createIdea(ideas[i]);
        main.appendChild(d);
    }
  
    let sell_button = document.getElementById('sell-idea');
    sell_button.addEventListener('click',function(){
      removeIdeas();
      if(nr == 1){
        let a = document.getElementById('back-to-ideas');
        let b = document.getElementById('nav-bar');
        if(a) b.removeChild(a);
      }
      listYourIdea();
    });

    let about_button = document.getElementById('about');
    about_button.addEventListener('click',function(){
      removeIdeas();
      if(nr == 1){
        let a = document.getElementById('nav-back-from-about');
        let b = document.getElementById('nav-bar');
        if(a) b.removeChild(a);
      }
      goToAboutPage();
    });

    let list_id = [];
    for(i in ideas){
      list_id[i] = ideas[i].id;
    }


    
    for(i in list_id){
        let a = document.getElementById(list_id[i]);
        a.addEventListener('click',function(){
          fetch(`http://localhost:3000/ideas/${a.id}`, {
        method: 'DELETE',
        }).then(function () {
          localStorage.setItem("key",a.id);
          removeIdeas();
          getIdeasFromServer();
          nr = 1;
        });
        });
      
    }
  
}                                                                                             


function removeNavBar(){
  let nav_bar = document.getElementById('nav-bar');
  let sell = document.getElementById('nav-sell');
  let about = document.getElementById('nav-about');
  if(sell) nav_bar.removeChild(sell);
  if(about) nav_bar.removeChild(about);
}

function listYourIdea(){
    removeNavBar();
    let nav = document.createElement('li');
    let nav_bar = document.getElementById('nav-bar');
    nav.className = "navigation-item";
    let button_back = document.createElement('button');
    button_back.className = "item-button";
    button_back.innerHTML = "Back to ideas";
    nav.setAttribute("id", "back-to-ideas");
    nav.appendChild(button_back);
    nav_bar.appendChild(nav);

    let title = document.createElement('input');
    title.className = "idea-title";
    title.placeholder = "Enter idea title...";
    title.type = "text";
    title.setAttribute("id","form-title");
    let name = document.createElement('input');
    name.className = "seller-name";
    name.placeholder = "Enter your name...";
    name.type = "text";
    name.setAttribute("id","form-name");
    let contact = document.createElement('input');
    contact.className = "contact-list";
    contact.placeholder = "Enter your phone number...";
    contact.type = "text";
    contact.setAttribute("id","form-contact");
    let price = document.createElement('input');
    price.className = "idea-price";
    price.placeholder = "Enter idea price/$";
    price.type = "text";
    price.setAttribute("id","form-price");
    let div = document.createElement('div');
    div.className = "inputs";
    let description = document.createElement('textarea');
    description.className = "idea-descript";
    description.placeholder = "Write your idea...";
    description.type = "text";
    description.setAttribute("id","form-description");
    div.appendChild(title);
    div.appendChild(name);
    div.appendChild(contact);
    div.appendChild(price);
    let div1 = document.createElement('div');
    div1.className = "description-sell";
    div1.appendChild(description);
    let div0 = document.createElement('div');
    div0.className = "inputs-sell-container";
    div0.appendChild(div);
    div0.appendChild(div1);
    main.appendChild(div0);

    let post = document.createElement('button');
    post.innerHTML = "POST";
    post.className = "post-button";
    post.setAttribute("id","post-press");

    let div3 = document.createElement('div');
    div3.className  = "post-button-container";
    div3.appendChild(post);
    main.appendChild(div3);

    post.addEventListener('click',function(){
      removeSellPage();
      const postObject = {
        title: title.value,
        name: name.value,
        price: price.value,
        contact: contact.value,
        description: description.value
    }
     addIdeaToServer(postObject);
    });

    button_back.addEventListener('click',function(){
      backToIdeas();
    });
  }


function removeIdeas() {
  while (main.firstChild) {
      main.removeChild(main.firstChild);
  }
}

function removeSellPage(){
  while (main.firstChild) {
    main.removeChild(main.firstChild);
  }
  let nav_bar = document.getElementById('nav-bar');
  let back_to_ideas = document.getElementById('back-to-ideas');
  nav_bar.removeChild(back_to_ideas);
  let nav_item = document.createElement('li');
  nav_item.className = "navigation-item";
  nav_item.setAttribute("id", "nav-sell");
  let button_sell = document.createElement('button');
  button_sell.className = "item-button";
  button_sell.setAttribute("id", "sell-idea");
  button_sell.innerHTML = "Sell idea";
  nav_item.appendChild(button_sell);
  nav_bar.appendChild(nav_item);
  let nav_about = document.createElement('li');
  nav_about.className = "navigation-item";
  nav_about.setAttribute("id", "nav-about");
  let button_about = document.createElement('button');
  button_about.className = "item-button";
  button_about.setAttribute("id", "about");
  button_about.innerHTML = "About";
  nav_about.appendChild(button_about);
  nav_bar.appendChild(nav_about);
}


function backToIdeas(){
  removeSellPage();
  getIdeasFromServer();
}

getIdeasFromServer();