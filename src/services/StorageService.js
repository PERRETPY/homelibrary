import { Storage } from '@capacitor/storage';
import { GoogleServer } from "./ServerService";


export class CapacitorStorage {
    constructor() {
        this.serverService = new GoogleServer();
    }
    async getAllBooks() {
        let allBooks = [];
        let keys = [];
        keys = (await Storage.keys()).keys;
        for (const isbn of keys) {
            await Storage.get({ key: isbn }).then(
                (book) => {
                    allBooks.push(JSON.parse(book.value));
                }
            )
        }
        return allBooks;
    }
    async getBookByISBN(isbn) {
        return JSON.parse((await Storage.get({key: isbn})).value);
    }
    async getBooksByFilters(searchKeyWord, available, read, tag) {
        let allBooks = await this.getAllBooks();
        let booksFilter = [];
        allBooks.forEach(
            (book) => {
                if((searchKeyWord === "" ? true : (
                            book.tags.includes(searchKeyWord)
                            || book.authors.includes(searchKeyWord)
                            || book.title.includes(searchKeyWord))
                    )
                    && (available === undefined ? true : book.available === available)
                    && (read === undefined ? true : book.read === read)
                    && (tag === "all" ? true : book.tags.includes(tag))) {
                    booksFilter.push(book);
                }
            }
        )
        return booksFilter;
    }
    async existByISBN(isbn) {
        return !!((await Storage.get({ key: isbn })).value);
    }
    async addBook(book) {
        return await Storage.set({
            key: book.isbn,
            value: JSON.stringify(book),
        });
    }
    async updateBook(isbn, book) {
        return Storage.set({
            key: isbn,
            value: JSON.stringify(book),
        });
    }
    async removeBookByISBN(isbn) {
        return await Storage.remove({key: isbn});
    }
    async resetDatabase() {
        return await Storage.clear();
    }
    async addBookByISBNandValues(isbn, book) {
        this.serverService.getBookByISBN(isbn).then(
            (response) => {
                const bookServer = response.data.volumeInfo

                const newBook = {};
                newBook.isbn = isbn;
                newBook.title = bookServer.title;
                newBook.authors = bookServer.authors;
                newBook.publishedDate = bookServer.publishedDate;
                newBook.description = bookServer.description;
                newBook.ratingsCount = bookServer.ratingsCount;
                newBook.averageRating = bookServer.averageRating;
                newBook.tags = book.tags;
                newBook.selfRate = book.selfRate;
                newBook.review = book.review;
                newBook.available = book.available;
                newBook.availableNote = book.availableNote;
                newBook.read = book.read;

                if(bookServer.imageLinks && bookServer.imageLinks.thumbnail) {
                    newBook.imageLink = bookServer.imageLinks.thumbnail;
                }

                this.addBook(newBook);
            }
        )
    }
}
