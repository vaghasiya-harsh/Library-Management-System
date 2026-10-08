import { bookData } from "./data/data";

function App() {
  return (
    <div>
      <h1>Library Management System</h1>

      <p>Total Books: {bookData.length}</p>
      <hr />

      <h2>All Books</h2>

      {bookData.map((book) => {
        return (
          <div key={book.id}>
            <h3>{book.title}</h3>

            <p>Book ID: {book.id}</p>
            <p>Author: {book.author}</p>
            <p>Category: {book.category}</p>
            <p>ISBN: {book.isbn}</p>
            <p>Publisher: {book.publisher}</p>
            <p>Published Year: {book.publishedYear}</p>
            <p>Total Copies: {book.totalCopies}</p>
            <p>Available Copies: {book.availableCopies}</p>

            <hr />
          </div>
        );
      })}
    </div>
  );
}

export default App;
