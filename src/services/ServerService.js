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
                    console.log('HELLO : ');
                    console.log(response);
                    book = axios.get(response.data.items[0].selfLink);
                }
            )
            .catch((error) => {
                console.log(error);
            });
        return book;
    }
    getBooksBySearch(keywords) {
        axios
            .get(this.baseUrl + '?q=' + keywords)
            .then(
                (response) => {
                    let requestLink = [];
                    response.data.items.forEach(
                        (item) => {
                            console.log('push');
                            requestLink.push(item.selfLink);
                        }
                    )
                    console.log('return');
                    //return axios.get(response.data.items[0].selfLink)
                    return axios.all(requestLink.map((request) => axios.get(request)));
                    //console.log(axios.all(requestLink.map((request) => axios.get(request))));
                }
            )
            .catch((error) => {
                console.log(error);
            });
    }
}
