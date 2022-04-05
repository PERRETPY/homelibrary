import { db } from "../db";

export class DexieService {
    constructor() {
        this.baseUrl = '';
    }
    async getAllBooks() {
        return await db.books.toArray();
    }
    async getBookByISBN(isbn) {
        return await db.books.get({isbn: isbn});
    }
    async getBooksByFilters(searchKeyWord, available, read, tag) {
        return await db.books.orderBy("title").filter(
            (book) => {
                if((searchKeyWord === "" ? true : (
                            book.tags.includes(searchKeyWord)
                            || book.authors.includes(searchKeyWord)
                            || book.title.includes(searchKeyWord))
                    )
                    && (available === undefined ? true : book.available === available)
                    && (read === undefined ? true : book.read === read)
                    && (tag === "all" ? true : book.tags.includes(tag))
                ) {
                    return true;
                }
            }
        ).toArray();
    }
    async existByISBN(isbn) {
        return !!(await db.books.get({isbn: isbn}));
    }
    async addBook(book) {
        return await db.books.add(book);
    }
    async updateBook(isbn, book) {
        return await db.books.where("isbn").equals(isbn).modify(book);
    }
    async resetDatabase() {
        db.books.clear();
    }
}
