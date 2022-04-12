<template>
  <div class="container">
    <button class="button is-danger" @click="resetDatabase()">Reset database</button>
    <table class="table is-fullwidth is-hoverable">
      <thead>
        <tr>
          <th>ISBN</th>
          <th>Titre</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody v-if="!loading">
        <tr v-for="book in bookList" :key="book.isbn">
          <td>{{ book.isbn }}</td>
          <td>{{ book.title }}</td>
          <td>
            <button class="button is-danger" @click="deleteBook(book.isbn)">X</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import {CapacitorStorage} from "../services/StorageService"

export default {
  name: "AppTestActions",
  data() {
    return {
      storageService: {},
      bookList: [],
      loading: false
    }
  },
  mounted() {
    this.storageService = new CapacitorStorage();
    this.getAllBooks();
  },
  methods: {
    getAllBooks: function() {
      this.loading = true;
      this.storageService.getAllBooks().then(
          (allBooks) => {
            this.bookList = allBooks;
            this.loading = false;
          }
      )
    },
    deleteBook: function(isbn) {
      this.storageService.removeBookByISBN(isbn).then(
        () => {
          this.getAllBooks()
        }
      )
    },
    resetDatabase: function() {
      this.storageService.resetDatabase().then(
          () => {
            this.getAllBooks();
          }
      )
    }
  }
}
</script>

<style scoped>

</style>
