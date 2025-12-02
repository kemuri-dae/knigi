// script.js — с добавлением редактирования и удаления

let editingId = null; // если null — добавление, если число — режим редактирования

const initialBooks = [
    { id: 1, title: "Путь программиста", author: "Айдар Сатыбалдиев", date: "2023-02-15" },
    { id: 2, title: "Алгоритмы и логика", author: "Медет Жумабек", date: "2022-11-01" },
    { id: 3, title: "Веб-разработка для начинающих", author: "Санжар Куралбаев", date: "2024-01-22" }
];

function getStoredBooks() {
    return JSON.parse(localStorage.getItem("books") || "null");
}

function saveBooks(arr) {
    localStorage.setItem("books", JSON.stringify(arr));
}

function ensureStorageInitialized() {
    if (!getStoredBooks()) {
        saveBooks(initialBooks.slice());
    }
}

function renderTable() {
    const table = document.getElementById("booksTable");

    while (table.rows.length > 1) table.deleteRow(1);

    const books = getStoredBooks() || [];

    books.forEach(book => {
        const row = table.insertRow(-1);

        row.insertCell(0).innerText = book.id;
        row.insertCell(1).innerText = book.title;
        row.insertCell(2).innerText = book.author;
        row.insertCell(3).innerText = book.date;

        // Создаём ячейку действий
        const actions = row.insertCell(4);
        actions.innerHTML = `
            <button class="edit-btn" onclick="editBook(${book.id})">Редактировать</button>
            <button class="delete-btn" onclick="deleteBook(${book.id})">Удалить</button>
        `;
    });

    applyFilters();
}

function addBook(title, author, date) {
    const books = getStoredBooks() || [];

    const newId = books.length ? Math.max(...books.map(b => b.id)) + 1 : 1;

    const newBook = { id: newId, title, author, date };
    books.push(newBook);

    saveBooks(books);
    renderTable();
}

function editBook(id) {
    const books = getStoredBooks();
    const book = books.find(b => b.id === id);

    if (!book) return;

    // Загружаем данные в форму
    document.getElementById("bookTitle").value = book.title;
    document.getElementById("bookAuthor").value = book.author;
    document.getElementById("bookDate").value = book.date;

    // Ставим режим редактирования
    editingId = id;

    // Меняем текст кнопки
    document.getElementById("addBookBtn").innerText = "Сохранить изменения";
}

function saveEditedBook(title, author, date) {
    const books = getStoredBooks();

    const index = books.findIndex(b => b.id === editingId);
    if (index === -1) return;

    books[index].title = title;
    books[index].author = author;
    books[index].date = date;

    saveBooks(books);

    editingId = null;
    document.getElementById("addBookBtn").innerText = "Добавить";

    renderTable();
}

function deleteBook(id) {
    let books = getStoredBooks();
    books = books.filter(b => b.id !== id);

    saveBooks(books);
    renderTable();
}

function applyFilters() {
    const searchValue = document.getElementById("searchInput").value.toLowerCase();
    const from = document.getElementById("dateFrom").value;
    const to = document.getElementById("dateTo").value;

    const rows = document.querySelectorAll("#booksTable tr");

    for (let i = 1; i < rows.length; i++) {
        const cols = rows[i].querySelectorAll("td");
        const title = cols[1].innerText.toLowerCase();
        const date = cols[3].innerText;

        let show = true;

        if (searchValue && !title.includes(searchValue)) show = false;
        if (from && date < from) show = false;
        if (to && date > to) show = false;

        rows[i].style.display = show ? "" : "none";
    }
}

document.addEventListener("DOMContentLoaded", function() {
    ensureStorageInitialized();
    renderTable();

    // Поиск
    document.getElementById("searchInput").addEventListener("input", applyFilters);

    // Фильтр
    document.getElementById("dateFrom").addEventListener("change", applyFilters);
    document.getElementById("dateTo").addEventListener("change", applyFilters);
    document.getElementById("filterBtn").addEventListener("click", applyFilters);

    // Добавление / сохранение
    document.getElementById("addBookBtn").addEventListener("click", function() {
        const title = document.getElementById("bookTitle").value.trim();
        const author = document.getElementById("bookAuthor").value.trim();
        const date = document.getElementById("bookDate").value;

        if (!title || !author || !date) {
            alert("Заполните все поля!");
            return;
        }

        if (editingId === null) {
            addBook(title, author, date);
        } else {
            saveEditedBook(title, author, date);
        }

        // очистить форму
        document.getElementById("bookTitle").value = "";
        document.getElementById("bookAuthor").value = "";
        document.getElementById("bookDate").value = "";
    });
});
