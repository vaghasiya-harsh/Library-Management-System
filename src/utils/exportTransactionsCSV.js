
export function exportTransactionsCSV(
    transactions,
    books,
    members
) {
    const headers = [
        "Transaction ID",
        "Book ID",
        "Book Title",
        "Member ID",
        "Member Name",
        "Issue Date",
        "Due Date",
        "Return Date",
        "Status",
    ];

    const escapeCSV = (value) => {
        let text = String(value ?? "");

        // Avoid spreadsheet formula execution for untrusted text.
        if (/^[\s]*[=+\-@]/.test(text)) {
            text = `'${text}`;
        }

        return `"${text.replace(/"/g, '""')}"`;
    };

    const rows = transactions.map((transaction) => {
        const book = books.find(
            (item) => item.id === transaction.bookId
        );

        const member = members.find(
            (item) => item.id === transaction.memberId
        );

        return [
            transaction.id,
            transaction.bookId,
            book?.title || "",
            transaction.memberId,
            member?.name || "",
            transaction.issueDate,
            transaction.dueDate,
            transaction.returnDate || "",
            transaction.status,
        ];
    });

    const csv = [headers, ...rows]
        .map((row) => row.map(escapeCSV).join(","))
        .join("\r\n");

    // BOM helps Excel recognise UTF-8 text.
    const blob = new Blob(["\uFEFF", csv], {
        type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "library-transactions.csv";

    document.body.appendChild(link);
    link.click();
    link.remove();

    URL.revokeObjectURL(url);
}
