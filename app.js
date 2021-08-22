'use strict';

let myLibrary;

function Book(title, author, pages, read) {
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.read = read;
}

Book.prototype.info = function () {
    return `${this.title} by ${this.author}, ${this.pages} pages, ${this.read}`;
};

Book.prototype.toggleRead = function () {
    if (this.read == 'read') {
        this.read = 'not read yet';
    }
    else {
        this.read = 'read';
    }
};

function addBookToLibrary(title, author, pages, read) {
    let newBook = new Book(title, author, pages, read);
    myLibrary.push(newBook);
}

function removeBookFromLibrary(indexBook) {
    myLibrary.splice(indexBook, 1);
}

function toggleBookFromLibrary(indexBook) {
    myLibrary[indexBook].toggleRead();
}

function resetContainer(containerElement) {
    while (containerElement.hasChildNodes()) {
        containerElement.removeChild(containerElement.firstChild);
    }
}

function displayBook(book, indexBook) {
    let div = document.createElement('div');
    div.className = 'card';
    div.dataset.index = indexBook;
    let p = document.createElement('p');
    p.innerHTML = book.title;
    div.appendChild(p);
    let q = document.createElement('p');
    q.innerHTML = book.author;
    div.appendChild(q);
    let r = document.createElement('p');
    r.innerHTML = book.pages;
    div.appendChild(r);
    let s = document.createElement('p');
    s.innerHTML = book.read;
    div.appendChild(s);
    return div;
}

function displayRemoveButton(indexBook, containerElement) {
    let remove = document.createElement('button');
    remove.className = 'remove';
    remove.innerHTML = 'Remove';
    remove.addEventListener('click', event => {
        removeBookFromLibrary(indexBook);
        recordLibrary();
        displayLibrary(containerElement);
        console.log(`Book number ${indexBook} removed!`);
    });
    return remove;
}

function displayToggleButton(indexBook, containerElement) {
    let toggleRead = document.createElement('button');
    toggleRead.className = 'toggle';
    toggleRead.innerHTML = 'Toggle read status';
    toggleRead.addEventListener('click', event => {
        toggleBookFromLibrary(indexBook);
        recordLibrary();
        displayLibrary(containerElement);
        console.log(`Book number ${indexBook} toggled.`);
    });
    return toggleRead;
}

function displayLibrary(containerElement) {
    resetContainer(containerElement);
    myLibrary.forEach((value, index) => {
        let div = displayBook(value, index);
        let remove = displayRemoveButton(index, containerElement);
        div.appendChild(remove);
        let toggleRead = displayToggleButton(index, containerElement);
        div.appendChild(toggleRead);
        containerElement.appendChild(div);
        let hr = document.createElement('hr');
        containerElement.appendChild(hr);
    });
}


function loadPage(containerElement) {
    window.addEventListener('load', function (e) {
        retrieveLibrary();
        displayLibrary(containerElement);
    }, false);
}

function displayForm(buttonElement, formElement) {
    buttonElement.addEventListener('click', function (e) {
        formElement.style.display = 'block';
        buttonElement.disabled = true;
    }, false);
}

function submitBook(formElement, containerElement, newBook) {
    formElement.addEventListener('submit', event => {
        event.preventDefault();
        let elements = formElement.elements;
        let title = elements['title'].value;
        let author = elements['author'].value;
        let pages = elements['pages'].value;
        let read;
        let reads = elements['read'];
        for (const element of reads) {
            if (element.checked) {
                read = element.value;
                break;
            }
        }
        addBookToLibrary(title, author, pages, read);
        recordLibrary();
        displayLibrary(containerElement);
        formElement.parentNode.style.display = 'none';
        newBook.disabled = false;
    }, false);
}

function retrieveLibrary() {
    let library = JSON.parse(localStorage.getItem("library"));
    if (library == []) {
        myLibrary = [];
    }
    else {
        myLibrary = library;
    }
}

function recordLibrary() {
    localStorage.setItem("library", JSON.stringify(myLibrary));
}

let container = document.querySelector('#container');
let divForm = document.querySelector('#new-book-form');
let form = document.querySelector('form');
let newBook = document.querySelector('#new-book');

loadPage(container);
displayForm(newBook, divForm);
submitBook(form, container, newBook);