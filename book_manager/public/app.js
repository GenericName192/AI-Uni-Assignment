const apiUrl = "http://localhost:3000/api/books"; // Your API endpoint
let currentEditingId = null;

// Fetch books from the API
async function fetchBooks() {
  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return await response.json(); // Return the JSON response (array of books)
  } catch (error) {
    console.error("Error fetching books:", error);
    return []; // Return an empty array if there's an error
  }
}

// Function to search books
async function searchBooks() {
  const query = document.getElementById("searchInput").value.toLowerCase(); // Get search input
  const allBooks = await fetchBooks(); // Fetch all books

  // Filter books based on title, author, or genre
  return allBooks.filter(
    (book) =>
      book.title.toLowerCase().includes(query) ||
      book.author.toLowerCase().includes(query) ||
      book.genre.toLowerCase().includes(query)
  );
}

// Display books in the list
async function displayBooks(books = null) {
  const bookList = document.getElementById("bookList");
  bookList.innerHTML = ""; // Clear existing list

  const booksToDisplay = books || (await fetchBooks()); // Use passed books or fetch all

  if (booksToDisplay.length === 0) {
    bookList.innerHTML = "<li>No books available</li>"; // Show message if no books found
  } else {
    booksToDisplay.forEach((book) => {
      const li = document.createElement("li");
      li.innerHTML = `
                ${book.title} by ${book.author} (${book.year}) [${book.genre}] 
                - ${book.available ? "Available" : "Checked Out"}
                <button onclick="editBook(${book.id}, '${book.title}', '${
        book.author
      }', ${book.year}, '${book.genre}')">Edit</button>
                <button onclick="removeBook(${book.id})">Delete</button>
                <button onclick="toggleAvailability(${book.id}, ${
        book.available
      })">
                    ${book.available ? "Check Out" : "Return"}
                </button>
            `;
      bookList.appendChild(li);
    });
  }
}

// Function to edit a book
function editBook(id, title, author, year, genre) {
  currentEditingId = id; // Set the ID of the book being edited
  document.getElementById("title").value = title; // Populate the title input
  document.getElementById("author").value = author; // Populate the author input
  document.getElementById("year").value = year; // Populate the year input
  document.getElementById("genre").value = genre; // Populate the genre input
}

// Event listener for the book form submission
document
  .getElementById("bookForm")
  .addEventListener("submit", async function (e) {
    e.preventDefault(); // Prevent default form submission
    const title = document.getElementById("title").value;
    const author = document.getElementById("author").value;
    const year = document.getElementById("year").value;
    const genre = document.getElementById("genre").value;

    const book = { title, author, year, genre }; // Create book object

    if (currentEditingId) {
      await updateBook(currentEditingId, book); // Update existing book
      currentEditingId = null; // Reset editing ID
    } else {
      await addBook(book); // Add new book
    }

    document.getElementById("bookForm").reset(); // Reset form
    displayBooks(); // Refresh the book list
  });

// Event listener for the search input
document
  .getElementById("searchInput")
  .addEventListener("input", async function () {
    const searchedBooks = await searchBooks(); // Get filtered books
    displayBooks(searchedBooks); // Display the filtered books
  });

// Function to add a new book
async function addBook(book) {
  const response = await fetch(apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(book),
  });

  if (!response.ok) {
    const error = await response.json();
    console.error("Error adding book:", error);
  }
}

// Function to update an existing book
async function updateBook(id, book) {
  const response = await fetch(`${apiUrl}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(book),
  });

  if (!response.ok) {
    const error = await response.json();
    console.error("Error updating book:", error);
  }
}

// Function to remove a book
async function removeBook(id) {
  const confirmed = confirm("Are you sure you want to delete this book?");
  if (confirmed) {
    await fetch(`${apiUrl}/${id}`, {
      method: "DELETE",
    });
    displayBooks(); // Refresh the book list
  }
}

// Function to toggle availability
async function toggleAvailability(id, available) {
  await fetch(`/api/books/checkout/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ available: !available }),
  });
  displayBooks(); // Refresh the book list
}

// Call to display books when the page loads
displayBooks();
