import axios from "axios";

export class GoogleServer {
    constructor() {
        this.baseUrl = 'https://www.googleapis.com/books/v1/volumes';
    }
    async getBookByISBN(isbn) {
        let book;
        await axios
            .get(this.baseUrl + '?q=isbn:' + isbn)
            .then(
                (response) => {
                    book = axios.get(response.data.items[0].selfLink);
                }
            )
            .catch((error) => {
                console.log(error);
            });
        return book;
    }
    async getBooksBySearch(keywords) {
        let books;
        console.log('search By Keywords');
        await axios
            .get(this.baseUrl + '?q=' + keywords)
            .then(
                (response) => {
                    let requestLink = [];
                    response.data.items.forEach(
                        (item) => {
                            requestLink.push(item.selfLink);
                        }
                    )
                    books = axios.all(requestLink.map((request) => axios.get(request)));
                }
            )
            .catch((error) => {
                console.log(error);
            });
        return books;
    }
}
