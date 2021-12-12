const bookList = [];
let bookId;
let myUser = {};

document.addEventListener("DOMContentLoaded", function() {
  // I am going to be user 6
  fetch("http://localhost:3000/users/6")
    .then(resp => resp.json())
    .then(user => { 
      myUser = { ...user };
      console.log(myUser);
    });

  fetch("http://localhost:3000/books")
  .then(resp => resp.json())
  .then(books => {
    const ul = document.getElementById("list");
    books.forEach(book => {
      bookList.push(book);
      let li = document.createElement("li");
      li.textContent = book.title;
      li.id = book.id;
      li.addEventListener("click", handleTitleClick);
      ul.append(li);
    });
    console.log(bookList);
  });

});

function handleTitleClick(event) {
  console.log("Title clicked");
  bookId = parseInt(event.target.id);
  const book = bookList[bookId - 1];
  console.log(book);
  renderBook(book);

}

function renderBook(bk) {
  const div = document.querySelector("#show-panel");
  div.innerHTML = "";
  const img = document.createElement("img");
  img.src = bk.img_url;
  div.append(img);
  div.append(pElement(bk.title));
  div.append(pElement(bk.subTitle));
  div.append(pElement(bk.description));
  div.append(pElement(bk.author));
  const ul = document.createElement("ul");
  bk.users.forEach(user => {
    const li = document.createElement("li");
    li.textContent = user.username;
    ul.append(li);
  });
  div.append(ul);
  const btn = document.createElement("button");
  btn.textContent = "Like";
  btn.addEventListener("click", handleLikeCLick);
  div.append(btn);
}

function pElement(text) {
  const p = document.createElement("p")
  p.textContent = text;
  return(p);
}

function handleLikeCLick(event) {
  console.log("Like button clicked");
  const usersWhoLikeBook = bookList[bookId - 1].users;
  if (usersWhoLikeBook.includes(myUser)) {
    usersWhoLikeBook.pop();
  } else {
    usersWhoLikeBook.push(myUser)
  }
  const dataObj = {
    users: usersWhoLikeBook
  }

  fetch(`http://localhost:3000/books/${bookId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(dataObj)
  })
  .then(resp => resp.json())
  .then(result => renderBook(result))
  .catch(err => alert(`Book likes update failed ${err.message}`));
  
}