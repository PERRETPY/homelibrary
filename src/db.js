import Dexie from 'dexie';

export const db = new Dexie('myDatabase');
db.version(2).stores({
    books: '+isbn, title, authors, publishedDate, description, tags, ratingsCount, averageRating, selfRate, review, available, availableNote, read, imageLink',
});
