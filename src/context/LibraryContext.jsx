import { createContext, useEffect, useState } from "react";
import { bookData } from "../data/data";

export const LibraryContext = createContext();

function loadFromStorage(key, fallbackValue) {
  try {
    const savedData = localStorage.getItem(key);

    if (savedData === null) {
      return fallbackValue;
    }

    const parsedData = JSON.parse(savedData);

    // We expect arrays for books, members and transactions.
    if (!Array.isArray(parsedData)) {
      return fallbackValue;
    }

    return parsedData;
  } catch (error) {
    console.error(`Could not load ${key} from localStorage:`, error);
    return fallbackValue;
  }
}

export function LibraryProvider({ children }) {
  const [books, setBooks] = useState(() =>
    loadFromStorage("library_books_v1", bookData),
  );

  const [members, setMembers] = useState(() =>
    loadFromStorage("library_members_v1", []),
  );

  const [transactions, setTransactions] = useState(() =>
    loadFromStorage("library_transactions_v1", []),
  );

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

  const generateTransactionId = () => {
    const highestId = transactions.reduce((max, transaction) => {
      const number = Number(transaction.id.replace("TRX", ""));

      return Number.isFinite(number) ? Math.max(max, number) : max;
    }, 0);

    return `TRX${String(highestId + 1).padStart(3, "0")}`;
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

  const issueBook = ({ bookId, memberId, issueDate, dueDate }) => {
    const book = books.find((item) => item.id === bookId);
    const member = members.find((item) => item.id === memberId);

    if (!book) {
      return { success: false, message: "Book not found." };
    }

    if (!member) {
      return { success: false, message: "Member not found." };
    }

    if (member.status !== "Active") {
      return {
        success: false,
        message: "Only active members can borrow books.",
      };
    }

    if (Number(book.availableCopies) <= 0) {
      return {
        success: false,
        message: "This book is currently unavailable.",
      };
    }

    if (!issueDate || !dueDate || dueDate < issueDate) {
      return {
        success: false,
        message: "Due date must be on or after the issue date.",
      };
    }

    const activeTransactions = transactions.filter(
      (transaction) =>
        transaction.memberId === memberId &&
        ["Issued", "Overdue"].includes(transaction.status),
    );

    if (activeTransactions.length >= 3) {
      return {
        success: false,
        message: "A member can borrow a maximum of 3 active books.",
      };
    }

    const newTransaction = {
      id: generateTransactionId(),
      bookId,
      memberId,
      issueDate,
      dueDate,
      returnDate: null,
      status: "Issued",
    };

    setTransactions((current) => [...current, newTransaction]);

    setBooks((currentBooks) =>
      currentBooks.map((item) =>
        item.id === bookId
          ? {
              ...item,
              availableCopies: Number(item.availableCopies) - 1,
            }
          : item,
      ),
    );

    return { success: true };
  };

  const returnBook = (transactionId) => {
    const transaction = transactions.find((item) => item.id === transactionId);

    if (!transaction) {
      return {
        success: false,
        message: "Transaction not found.",
      };
    }

    if (!["Issued", "Overdue"].includes(transaction.status)) {
      return {
        success: false,
        message: "This book has already been returned.",
      };
    }

    const today = new Date().toLocaleDateString("en-CA");

    setTransactions((current) =>
      current.map((item) =>
        item.id === transactionId
          ? {
              ...item,
              returnDate: today,
              status: "Returned",
            }
          : item,
      ),
    );

    setBooks((currentBooks) =>
      currentBooks.map((book) =>
        book.id === transaction.bookId
          ? {
              ...book,
              availableCopies: Math.min(
                Number(book.totalCopies),
                Number(book.availableCopies) + 1,
              ),
            }
          : book,
      ),
    );

    return { success: true };
  };

  // Save books whenever the books state changes.
  useEffect(() => {
    localStorage.setItem("library_books_v1", JSON.stringify(books));
  }, [books]);

  // Save members whenever the members state changes.
  useEffect(() => {
    localStorage.setItem("library_members_v1", JSON.stringify(members));
  }, [members]);

  // Save transactions whenever transactions change.
  useEffect(() => {
    localStorage.setItem(
      "library_transactions_v1",
      JSON.stringify(transactions),
    );
  }, [transactions]);

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

        issueBook,
        returnBook,
      }}
    >
      {children}
    </LibraryContext.Provider>
  );
}
