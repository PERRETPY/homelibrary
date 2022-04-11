import { Storage } from '@capacitor/storage';

export class CapacitorStorage {
    constructor() {
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
        return await Storage.set({
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
}
