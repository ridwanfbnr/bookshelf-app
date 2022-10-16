const books = [];
const RENDER_EVENT = "render-books";
const SAVED_EVENT = "save-books";
const STORAGE_KEY = "BOOKS_SHELF";
const generateId = () => +new Date();
const bookObject = (id, title, author, year, isCompleted) => {
  return {
    id,
    title,
    author,
    year,
    isCompleted,
  };
};

window.addEventListener("DOMContentLoaded", () => {
  const submitBook = document.getElementById("inputBook");
  const inputBook = document.getElementById("inputBookIsComplete");
  const inputSearchBook = document.getElementById("searchBookTitle");

  submitBook.addEventListener("submit", (e) => {
    e.preventDefault();
    addBook();
  });

  inputBook.addEventListener("input", (e) => {
    e.preventDefault();
    const span = document.querySelector("span");

    if (document.getElementById("inputBookIsComplete").checked) {
      span.innerText = "Selesai dibaca";
    } else {
      span.innerText = "Belum selesai dibaca";
    }
  });

  inputSearchBook.addEventListener("keyup", (e) => {
    e.preventDefault();
    searchBook();
  });

  if (isStorageExist()) {
    loadDataFromStorage();
  }
});

document.addEventListener(RENDER_EVENT, () => {
  const inCompleteBooks = document.getElementById("incompleteBookshelfList");
  inCompleteBooks.innerHTML = "";

  const completeBooks = document.getElementById("completeBookshelfList");
  completeBooks.innerHTML = "";

  for (const itemBook of books) {
    const elementBooks = makeBook(itemBook);
    if (!itemBook.isCompleted) {
      inCompleteBooks.append(elementBooks);
    } else {
      completeBooks.append(elementBooks);
    }
  }
});

document.addEventListener(SAVED_EVENT, () => {
  alert("Data Buku Berhasil di Tambahkan");
});

function loadDataFromStorage() {
  const serializedData = localStorage.getItem(STORAGE_KEY);
  const data = JSON.parse(serializedData);

  if (data !== null) {
    for (const book of data) {
      books.push(book);
    }
  }

  document.dispatchEvent(new Event(RENDER_EVENT));
}

function isStorageExist() {
  if (typeof Storage === "undefined") {
    alert("Storage is not available");
    return false;
  }
  return true;
}

function findBook(bookId) {
  for (const bookItem of books) {
    if (bookItem.id === bookId) {
      return bookItem;
    }
  }
  return null;
}

function findBookIndex(bookId) {
  for (const index in books) {
    if (books[index].id === bookId) {
      return index;
    }
  }
}

function saveData() {
  if (isStorageExist()) {
    const parsed = JSON.stringify(books);
    localStorage.setItem(STORAGE_KEY, parsed);
  }
}

function addBook() {
  const title = document.getElementById("inputBookTitle").value;
  const author = document.getElementById("inputBookAuthor").value;
  const year = +document.getElementById("inputBookYear").value;
  const isCompleted = document.getElementById("inputBookIsComplete").checked;
  const id = generateId();

  const newBook = bookObject(id, title, author, year, isCompleted);

  books.push(newBook);

  document.dispatchEvent(new Event(RENDER_EVENT));
  document.dispatchEvent(new Event(SAVED_EVENT));
  saveData();
}

function undoBookFromComplete(bookId) {
  const bookTarget = findBook(bookId);

  bookTarget.isCompleted = false;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function removeBook(bookId) {
  const bookTarget = findBookIndex(bookId);

  books.splice(bookTarget, 1);

  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function addBookToComplete(bookId) {
  const bookTarget = findBook(bookId);

  if (bookTarget === null) return;

  bookTarget.isCompleted = true;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function searchBook() {
  const searchBooks = document.getElementById("searchBookTitle").value;
  const bookItem = document.querySelectorAll(
    "section.book_shelf > .book_list > .book_item",
  );

  for (let i = 0; i < bookItem.length; i++) {
    let textValue = bookItem[i].innerText;

    if (textValue.toLowerCase().includes(searchBooks.toLowerCase())) {
      bookItem[i].style.display = "";
    } else {
      bookItem[i].style.display = "none";
    }
  }
}

function makeBook(bookObject) {
  const textTitle = document.createElement("h3");
  textTitle.innerText = bookObject.title;

  const textAuthor = document.createElement("p");
  textAuthor.innerText = `Penulis: ${bookObject.author}`;

  const textYear = document.createElement("p");
  textYear.innerText = `Tahun: ${bookObject.year}`;

  const greenButton = document.createElement("button");
  greenButton.classList.add("green");

  const redButton = document.createElement("button");
  redButton.classList.add("red");
  redButton.innerText = "Hapus Buku";

  redButton.addEventListener("click", () => {
    alert("Yakin ingin menghapus data buku tersebut ?");
    removeBook(bookObject.id);
  });

  if (bookObject.isCompleted) {
    greenButton.innerText = "Belum selesai dibaca";

    greenButton.addEventListener("click", () => {
      undoBookFromComplete(bookObject.id);
    });
  } else {
    greenButton.innerText = "Selesai dibaca";

    greenButton.addEventListener("click", () => {
      addBookToComplete(bookObject.id);
    });
  }

  const actionBooks = document.createElement("div");
  actionBooks.classList.add("action");
  actionBooks.append(greenButton, redButton);

  const containerBooks = document.createElement("article");
  containerBooks.classList.add("book_item");
  containerBooks.append(textTitle, textAuthor, textYear, actionBooks);

  return containerBooks;
}
