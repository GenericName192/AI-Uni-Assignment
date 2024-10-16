const apiUrl = 'http://localhost:3000/api/books'; // Update this URL if needed

async function fetchBooks() {
    const response = await fetch(apiUrl);
    const data = await response.json();
    return data;
}

async function displayBooks() {
    const books = await fetchBooks();
    const bookList = document.getElementById('bookList');
    bookList.innerHTML = '';

    books.forEach((book) => {
        const li = document.createElement('li');
        li.innerHTML = `
            ${book.title} by ${book.author} (${book.year}) [${book.genre}] 
            - ${book.available ? 'Available' : 'Checked Out'}
            <button onclick="editBook(${book.id})">Edit</button>
            <button onclick="removeBook(${book.id})">Delete</button>
            <button onclick="toggleAvailability(${book.id}, ${book.available})">
                ${book.available ? 'Check Out' : 'Return'}
            </button>
        `;
        bookList.appendChild(li);
    });
}

async function addBook(book) {
    await fetch(apiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(book)
    });
    displayBooks();
}

async function updateBook(book) {
    await fetch(`${apiUrl}/${book.id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(book)
    });
    displayBooks();
}

async function removeBook(id) {
    await fetch(`${apiUrl}/${id}`, {
        method: 'DELETE'
    });
    displayBooks();
}

async function toggleAvailability(id, available) {
    await fetch(`/api/books/checkout/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ available: !available })
    });
    displayBooks();
}

document.getElementById('bookForm').addEventListener('submit', async function (e) {
    e.preventDefault();
    const title = document.getElementById('title').value;
    const author = document.getElementById('author').value;
    const year = document.getElementById('year').value;
    const genre = document.getElementById('genre').value;

    const book = { title, author, year, genre };
    await addBook(book);
    document.getElementById('bookForm').reset();
});

displayBooks();
