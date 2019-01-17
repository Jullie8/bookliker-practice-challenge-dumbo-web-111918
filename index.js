document.addEventListener("DOMContentLoaded", function() {
    let ulListBooks = document.getElementById('list');
    let showPanel = document.querySelector('#show-panel');
    //TODO: This fetch function can be refactored 
    fetch('http://localhost:3000/books')
    .then((res)=>{
        return res.json();
    }).then((data)=>{
        data.forEach((el)=>{
        displayABookTitleOnDom(el)
        })
    })

    //event listeners
    ulListBooks.addEventListener('click', handleClickBookShow)
    showPanel.addEventListener('click', handleReadBook);


});
//end of DOM Content Loaded 

//output a single book 
function displayABookTitleOnDom(objJson) {
    let ulListBooks = document.getElementById('list');
    let createBookLi = document.createElement('li')
    createBookLi.className = 'book-li'
    createBookLi.dataset.id = objJson.id
    createBookLi.innerText = objJson.title
    ulListBooks.append(createBookLi);
}

//click handler for click of a book li
function handleClickBookShow (event) {
    // console.log(event.target)
    if (event.target.classList.contains('book-li')) {
        let idSelected = event.target.dataset.id;
        //fetch the id 
        fetch(`http://localhost:3000/books/${idSelected}`)
        .then((res)=>{
            return res.json()
        }).then((data)=>{
            singleBookShow(data)
        })
    }
}

function singleBookShow (objJson) {
    let showDiv = document.getElementById('show-panel');
    //creates the book h2 title

    showDiv.innerHTML = '';
    //the showDiv which is the parentDiv gets reset to empty each time
    showDiv.dataset.id = objJson.id

    let singleBookHeader = document.createElement('h2');
    singleBookHeader.innerText = objJson.title;
    //creates the book img 
    let singleBookImage = document.createElement('img');
    singleBookImage.src = objJson.img_url;
    //creates the p tag 
    let singleBookDescription = document.createElement('p');
    singleBookDescription.innerText = objJson.description; 
    //create the button
    let singleButton = document.createElement('button');
    singleButton.innerText = 'Read Book';
    singleButton.className = 'read-btn';
    //append the informtion to id with show-panel
    showDiv.append(singleBookHeader, singleBookImage, singleBookDescription, singleButton );
     showUserLikes(objJson)
}
function showUserLikes (objJsonUsers) {
    let showDiv = document.getElementById('show-panel');
    //create a ul id with user-likes
    if(objJsonUsers.users.length === 0){
        console.log('no users have liked this book')
    }else{
        let ulUser = document.createElement('ul');
        ulUser.className = 'user-list';
        //append the ul to the Div
        showDiv.append(ulUser)

        objJsonUsers.users.forEach((el) => {
             let userLi = document.createElement('li');
             //create the li with names 
             userLi.innerText = el.username
             userLi.dataset.id = el.id
            ulUser.appendChild(userLi);
         });    
    }
}

function handleReadBook (event) {
    if(event.target.className === 'read-btn') {
        let bookId = event.target.parentNode.dataset.id
        //get the parent node bc I want the children 
        let divContentUserUl = document.querySelector('#show-panel ul');
        let ulUserChildren = divContentUserUl.children
        let liUserArray = Array.from(ulUserChildren)
            

        newArrayofUserInfoObj = liUserArray.map((el)=>{
            let obj = {}
            obj.id = el.dataset.id;
            obj.username = el.innerText;
            return obj;
        });
        //do the check of the array of object to see if pouros exists
        //loop until it finds a single pourous if it does alert the user you read this 
        //else if it does not find pouros then add pouros
            if (newArrayofUserInfoObj.find(isPouros)=== undefined) {
                newArrayofUserInfoObj.push({
                    "id": 1,
                    "username": "pouros"
                });

                //console.log(newArrayofUserInfoObj)
                fetch(`http://localhost:3000/books/${bookId}`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accepts': 'application/json'
                    },
                    body: JSON.stringify({
                        users: newArrayofUserInfoObj
                    })
                }).then((res) => {
                    return res.json()
                }).then((data) => {
                    //pessimistic rendering 
                    singleBookShow(data);
                })    

            }else {
                alert('you read this')
            }
    }

}

function isPouros(userObj) {
    return userObj.username === "pouros";
}

