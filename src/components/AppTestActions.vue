<template>
  <div class="container">
    <p>Cette page permet de gérer la base de données directement afin de faciliter le test de l'application.</p>
    <p>Elle n'apparaitra pas dans une version finale de l'application.</p>
    <p>Le bouton "Charger des livres" permet d'ajouter un certains nombre de livre à la library automatiquement à partir du fichier .json se trouvant dans le dossier assets.</p>
    <button class="button is-danger" @click="resetDatabase()">Reset database</button>
    <button class="button is-info" @click="loadPresetBookList()">Charger des livres</button>
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
import jsonFile from "../assets/presetBookList.json"

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
    },
    async loadPresetBookList() {
      await jsonFile.forEach(
          (book) => {
            this.storageService.addBookByISBNandValues(book.isbn, book);
          }
      );
      this.getAllBooks();
    }
  }
}
</script>

<style scoped>

</style>
