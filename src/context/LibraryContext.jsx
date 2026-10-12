import { createContext, useState } from "react";
import { bookData } from "../data/data";

export const LibraryContext = createContext();

export function LibraryProvider({ children }) {
  const [books, setBooks] = useState(bookData);
  const [members, setMembers] = useState([]);
  const [transactions, setTransactions] = useState([]);

  // Generate the next book ID, for example BK0101
  const generateBookId = () => {
    const highestId = books.reduce((max, book) => {
      const number = Number(book.id.replace("BK", ""));
      return Number.isFinite(number) ? Math.max(max, number) : max;
    }, 0);

    return `BK${String(highestId + 1).padStart(4, "0")}`;
  };

  const generateMemberId = () => {
    const highestId = members.reduce((max, member) => {
      const number = Number(member.id.replace("MEM", ""));
      return Number.isFinite(number) ? Math.max(max, number) : max;
    }, 0);

    return `MEM${String(highestId + 1).padStart(3, "0")}`;
  };

  // CREATE
  const addBook = (bookDetails) => {
    const duplicateISBN = books.some(
      (book) => book.isbn.trim() === bookDetails.isbn.trim(),
    );

    if (duplicateISBN) {
      return {
        success: false,
        message: "A book with this ISBN already exists.",
      };
    }

    const newBook = {
      ...bookDetails,
      id: generateBookId(),
    };

    setBooks((currentBooks) => [...currentBooks, newBook]);

    return { success: true };
  };

  const addMember = (memberDetails) => {
    const emailExists = members.some(
      (member) =>
        member.email.trim().toLowerCase() ===
        memberDetails.email.trim().toLowerCase(),
    );

    if (emailExists) {
      return {
        success: false,
        message: "This email is already registered.",
      };
    }

    const newMember = {
      ...memberDetails,
      id: generateMemberId(),
      status: memberDetails.status || "Active",
    };

    setMembers((currentMembers) => [...currentMembers, newMember]);

    return { success: true };
  };

  // UPDATE
  const updateBook = (id, updatedDetails) => {
    const duplicateISBN = books.some(
      (book) =>
        book.id !== id && book.isbn.trim() === updatedDetails.isbn.trim(),
    );

    if (duplicateISBN) {
      return {
        success: false,
        message: "Another book already uses this ISBN.",
      };
    }

    const existingBook = books.find((book) => book.id === id);

    if (!existingBook) {
      return {
        success: false,
        message: "Book not found.",
      };
    }

    setBooks((currentBooks) =>
      currentBooks.map((book) =>
        book.id === id ? { ...book, ...updatedDetails, id: book.id } : book,
      ),
    );

    return { success: true };
  };

  const updateMember = (id, updatedDetails) => {
    const emailExists = members.some(
      (member) =>
        member.id !== id &&
        member.email.trim().toLowerCase() ===
          updatedDetails.email.trim().toLowerCase(),
    );

    if (emailExists) {
      return {
        success: false,
        message: "Another member already uses this email.",
      };
    }

    const existingMember = members.find((member) => member.id === id);

    if (!existingMember) {
      return {
        success: false,
        message: "Member not found.",
      };
    }

    setMembers((currentMembers) =>
      currentMembers.map((member) =>
        member.id === id
          ? { ...member, ...updatedDetails, id: member.id }
          : member,
      ),
    );

    return { success: true };
  };

  // DELETE
  const deleteBook = (id) => {
    const hasActiveTransaction = transactions.some(
      (transaction) =>
        transaction.bookId === id &&
        ["Issued", "Overdue"].includes(transaction.status),
    );

    if (hasActiveTransaction) {
      return {
        success: false,
        message: "This book has an active transaction and cannot be deleted.",
      };
    }

    setBooks((currentBooks) => currentBooks.filter((book) => book.id !== id));

    return { success: true };
  };

  const deleteMember = (id) => {
    const hasActiveTransaction = transactions.some(
      (transaction) =>
        transaction.memberId === id &&
        ["Issued", "Overdue"].includes(transaction.status),
    );

    if (hasActiveTransaction) {
      return {
        success: false,
        message: "This member has active issued books and cannot be deleted.",
      };
    }

    setMembers((currentMembers) =>
      currentMembers.filter((member) => member.id !== id),
    );

    return { success: true };
  };

  return (
    <LibraryContext.Provider
      value={{
        books,
        members,
        transactions,
        setMembers,
        setTransactions,

        addBook,
        updateBook,
        deleteBook,

        addMember,
        updateMember,
        deleteMember,
      }}
    >
      {children}
    </LibraryContext.Provider>
  );
}
