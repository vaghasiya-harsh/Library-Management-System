import { createContext, useState } from "react";
import { bookData } from "../data/data";

export const LibraryContext = createContext();

export function LibraryProvider({ children }) {
  const [books, setBooks] = useState(bookData);
  const [members, setMembers] = useState([]);
  const [transactions, setTransactions] = useState([]);

  return (
    <LibraryContext.Provider
      value={{
        books,
        setBooks,
        members,
        setMembers,
        transactions,
        setTransactions,
      }}
    >
      {children}
    </LibraryContext.Provider>
  );
}
