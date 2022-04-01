<template>
  <button @click="getAllTagsFromDatabase()">getAllTagsFromDatabase</button>
  <div class="columns is-multiline">
    <div class="column is-half-tablet is-one-third-desktop is-one-quarter-widescreen"
         v-for="book in booksList"
         :key="book.isbn">
      <BookPreview @click="showBooksDetails(book.isbn)" :book="book"></BookPreview>
    </div>
  </div>
</template>

<script>
import {db} from "../db";
import BookPreview from "./BookPreview";

export default {
  name: "Library.vue",
  components: {BookPreview},
  data() {
    return {
      booksList: [],
      loading: false
    }
  },
  setup() {
    return {
      db,
    };
  },
  mounted() {
    this.loading = true;
    this.getAllBooksFromDatabase();
  },
  methods: {
    getAllBooksFromDatabase: function() {
      this.db.books.toArray().then(
          (books) => {
            this.booksList = books;
            this.loading = false;
          }
      )
    },
    showBooksDetails(bookISBN) {
      this.$router.push({
        name: "Details",
        params: { id: bookISBN },
      });
    },
    async getAllTagsFromDatabase() {
      console.log(await this.db.books.where("tags").equals("test").toArray());
    }
  }
}
</script>

<style scoped>

</style>
