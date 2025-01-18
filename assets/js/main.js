const STORAGE_KEY = "BOOKSHELF_APP";
let books = [];

// Fungsi untuk menyimpan data ke localStorage
function saveData() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(books));
}

// Fungsi untuk memuat data dari localStorage
function loadData() {
  const serializedData = localStorage.getItem(STORAGE_KEY);
  books = serializedData ? JSON.parse(serializedData) : [];
}

// Fungsi untuk menghasilkan ID unik
function generateId() {
  return +new Date();
}

// Fungsi untuk membuat elemen buku
function createBookElement(book) {
  const container = document.createElement("div");
  container.dataset.bookid = book.id;
  container.dataset.testid = "bookItem";

  const title = document.createElement("h3");
  title.dataset.testid = "bookItemTitle";
  title.textContent = `Judul: ${book.title}`;
  title.onclick = () => alert(`Edit Buku: ${book.title}`);

  const author = document.createElement("p");
  author.dataset.testid = "bookItemAuthor";
  author.textContent = `Penulis: ${book.author}`;

  const year = document.createElement("p");
  year.dataset.testid = "bookItemYear";
  year.textContent = `Tahun: ${book.year}`;

  const buttonContainer = document.createElement("div");
  const toggleButton = document.createElement("button");
  toggleButton.dataset.testid = "bookItemIsCompleteButton";
  toggleButton.textContent = book.isComplete
    ? "Belum selesai dibaca"
    : "Selesai dibaca";
  toggleButton.onclick = () => toggleBookCompletion(book.id);

  const deleteButton = document.createElement("button");
  deleteButton.dataset.testid = "bookItemDeleteButton";
  deleteButton.textContent = "Hapus Buku";
  deleteButton.onclick = () => deleteBook(book.id);

  buttonContainer.appendChild(toggleButton);
  buttonContainer.appendChild(deleteButton);
  container.appendChild(title);
  container.appendChild(author);
  container.appendChild(year);
  container.appendChild(buttonContainer);

  return container;
}

// Fungsi untuk merender buku ke halaman
function renderBooks() {
  const incompleteBookshelf = document.getElementById(
    "incompleteBookshelfList"
  );
  const completeBookshelf = document.getElementById("completeBookshelfList");

  incompleteBookshelf.innerHTML = "";
  completeBookshelf.innerHTML = "";

  books.forEach((book) => {
    const bookElement = createBookElement(book);
    if (book.isComplete) {
      completeBookshelf.appendChild(bookElement);
    } else {
      incompleteBookshelf.appendChild(bookElement);
    }
  });
}

// Fungsi untuk menambahkan buku baru
document.getElementById("inputBook").addEventListener("submit", (e) => {
  e.preventDefault();
  const title = document.getElementById("inputBookTitle").value;
  const author = document.getElementById("inputBookAuthor").value;
  const year = parseInt(document.getElementById("inputBookYear").value);
  const isComplete = document.getElementById("inputBookIsComplete").checked;

  const newBook = {
    id: generateId(),
    title,
    author,
    year,
    isComplete,
  };

  books.push(newBook);
  saveData();
  renderBooks();
  e.target.reset(); // Reset form setelah submit
});

// Fungsi untuk memindahkan buku antar rak
function toggleBookCompletion(id) {
  const book = books.find((b) => b.id === id);
  if (book) {
    book.isComplete = !book.isComplete;
    saveData();
    renderBooks();
  }
}

// Fungsi untuk menghapus buku
function deleteBook(id) {
  books = books.filter((b) => b.id !== id);
  saveData();
  renderBooks();
}

// Fungsi untuk mencari buku berdasarkan judul
document.getElementById("searchBook").addEventListener("submit", (e) => {
  e.preventDefault();
  const query = document.getElementById("searchBookTitle").value.toLowerCase();

  const filteredBooks = books.filter((book) =>
    book.title.toLowerCase().includes(query)
  );

  const incompleteBookshelf = document.getElementById(
    "incompleteBookshelfList"
  );
  const completeBookshelf = document.getElementById("completeBookshelfList");

  incompleteBookshelf.innerHTML = "";
  completeBookshelf.innerHTML = "";

  filteredBooks.forEach((book) => {
    const bookElement = createBookElement(book);
    if (book.isComplete) {
      completeBookshelf.appendChild(bookElement);
    } else {
      incompleteBookshelf.appendChild(bookElement);
    }
  });
});

// Inisialisasi aplikasi
document.addEventListener("DOMContentLoaded", () => {
  loadData();
  renderBooks();
});
