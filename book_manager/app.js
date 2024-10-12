let books = [];

document.getElementById('bookForm').addEventListener('submit', function (e) {
  e.preventDefault();

  const title = document.getElementById('title').value;
  const author = document.getElementById('author').value;
  const year = document.getElementById('year').value;
  const genre = document.getElementById('genre').value;
  const bookIndex = document.getElementById('bookIndex').value;

  const book = { title, author, year, genre, available: true };

  if (bookIndex === '') {
    // Add new book
    books.push(book);
  } else {
    // Update existing book
    books[bookIndex] = book;
    document.getElementById('bookIndex').value = '';
  }

  document.getElementById('bookForm').reset();
  displayBooks();
});

function displayBooks() {
  const bookList = document.getElementById('bookList');
  bookList.innerHTML = '';

  books.forEach((book, index) => {
    const li = document.createElement('li');
    li.innerHTML = `
      ${book.title} by ${book.author} (${book.year}) [${book.genre}] 
      - ${book.available ? 'Available' : 'Checked Out'}
      <button onclick="editBook(${index})">Edit</button>
      <button onclick="removeBook(${index})">Delete</button>
      <button onclick="toggleAvailability(${index})">
        ${book.available ? 'Check Out' : 'Return'}
      </button>
    `;
    bookList.appendChild(li);
  });
}

function editBook(index) {
  const book = books[index];
  document.getElementById('title').value = book.title;
  document.getElementById('author').value = book.author;
  document.getElementById('year').value = book.year;
  document.getElementById('genre').value = book.genre;
  document.getElementById('bookIndex').value = index;
}

function removeBook(index) {
  books.splice(index, 1);
  displayBooks();
}

function toggleAvailability(index) {
  books[index].available = !books[index].available;
  displayBooks();
}

function searchBooks() {
  const searchTerm = document.getElementById('searchInput').value.toLowerCase();
  const filteredBooks = books.filter(book =>
    book.title.toLowerCase().includes(searchTerm) ||
    book.author.toLowerCase().includes(searchTerm) ||
    book.genre.toLowerCase().includes(searchTerm)
  );
  
  const bookList = document.getElementById('bookList');
  bookList.innerHTML = '';

  filteredBooks.forEach((book, index) => {
    const li = document.createElement('li');
    li.innerHTML = `
      ${book.title} by ${book.author} (${book.year}) [${book.genre}] 
      - ${book.available ? 'Available' : 'Checked Out'}
      <button onclick="editBook(${index})">Edit</button>
      <button onclick="removeBook(${index})">Delete</button>
      <button onclick="toggleAvailability(${index})">
        ${book.available ? 'Check Out' : 'Return'}
      </button>
    `;
    bookList.appendChild(li);
  });
}

displayBooks();
