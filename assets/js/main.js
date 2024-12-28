document.addEventListener("DOMContentLoaded", () => {
  const books = [];
  const RENDER_EVENT = "render-book";

  const inputBookForm = document.getElementById("inputBook");
  const searchBookForm = document.getElementById("searchBook");

  inputBookForm.addEventListener("submit", (event) => {
    event.preventDefault();
    addBook();
  });

  searchBookForm.addEventListener("submit", (event) => {
    event.preventDefault();
    searchBook();
  });

  function addBook() {
    const bookTitle = document.getElementById("inputBookTitle").value;
    const bookAuthor = document.getElementById("inputBookAuthor").value;
    const bookYear = document.getElementById("inputBookYear").value;
    const bookIsComplete = document.getElementById(
      "inputBookIsComplete"
    ).checked;

    const generatedID = generateId();
    const bookObject = generateBookObject(
      generatedID,
      bookTitle,
      bookAuthor,
      bookYear,
      bookIsComplete
    );
    books.push(bookObject);

    document.dispatchEvent(new Event(RENDER_EVENT));
  }

  function generateId() {
    return +new Date();
  }

  function generateBookObject(id, title, author, year, isComplete) {
    return {
      id,
      title,
      author,
      year,
      isComplete,
    };
  }

  function searchBook() {
    const searchBookTitle = document
      .getElementById("searchBookTitle")
      .value.toLowerCase();
    const filteredBooks = books.filter((book) =>
      book.title.toLowerCase().includes(searchBookTitle)
    );
    renderBookList(filteredBooks);
  }

  function renderBookList(bookData) {
    const containerIncomplete = document.getElementById(
      "incompleteBookshelfList"
    );
    const containerComplete = document.getElementById("completeBookshelfList");

    containerIncomplete.innerHTML = "";
    containerComplete.innerHTML = "";

    bookData.forEach((book) => {
      const bookItem = document.createElement("article");
      bookItem.classList.add("book_item", "select_item");
      bookItem.setAttribute("data-testid", "bookItem");
      bookItem.innerHTML = `
        <h3 name="${book.id}" data-testid="bookItemTitle">${book.title}</h3>
        <p data-testid="bookItemAuthor">Penulis: ${book.author}</p>
        <p data-testid="bookItemYear">Tahun: ${book.year}</p>
      `;

      const containerActionItem = document.createElement("div");
      containerActionItem.classList.add("action");

      const greenButton = createButton(
        book.isComplete ? "Belum selesai di Baca" : "Selesai di Baca",
        "green",
        () => {
          toggleCompleteStatus(book.id);
          renderBookList(books);
        }
      );
      greenButton.setAttribute("data-testid", "bookItemIsCompleteButton");

      const redButton = createButton("Hapus buku", "red", () => {
        deleteBook(book.id);
        renderBookList(books);
      });
      redButton.setAttribute("data-testid", "bookItemDeleteButton");

      containerActionItem.append(greenButton, redButton);
      bookItem.append(containerActionItem);

      if (book.isComplete) {
        containerComplete.append(bookItem);
      } else {
        containerIncomplete.append(bookItem);
      }

      bookItem
        .querySelector("h3")
        .addEventListener("click", () => updateBookForm(book));
    });
  }

  function createButton(buttonText, buttonTypeClass, eventListener) {
    const button = document.createElement("button");
    button.innerText = buttonText;
    button.classList.add(buttonTypeClass);
    button.addEventListener("click", eventListener);
    return button;
  }

  function toggleCompleteStatus(bookId) {
    const bookTarget = books.find((book) => book.id === bookId);
    if (bookTarget == null) return;

    bookTarget.isComplete = !bookTarget.isComplete;
    document.dispatchEvent(new Event(RENDER_EVENT));
  }

  function deleteBook(bookId) {
    const bookTargetIndex = books.findIndex((book) => book.id === bookId);
    if (bookTargetIndex === -1) return;

    books.splice(bookTargetIndex, 1);
    document.dispatchEvent(new Event(RENDER_EVENT));
  }

  function updateBookForm(book) {
    document.getElementById("inputBookTitle").value = book.title;
    document.getElementById("inputBookAuthor").value = book.author;
    document.getElementById("inputBookYear").value = book.year;
    document.getElementById("inputBookIsComplete").checked = book.isComplete;
  }

  document.addEventListener(RENDER_EVENT, () => {
    renderBookList(books);
  });
});
