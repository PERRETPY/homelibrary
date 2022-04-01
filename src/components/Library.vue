<template>
  <button @click="getBookForTagTest()">getBookForTagTest</button>
  <button @click="getAllTags()">getAllTags</button>

  <div v-if="allTags && allTags.length > 0">
    <label>Search by tag</label>
    <select @change="onChange($event)" v-model="searchTag">
      <option selected value="all"> Tous </option>
      <option v-for="tag in allTags" :key="tag" :value="tag">{{ tag }}</option>
    </select>
  </div>

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
      loading: false,
      allTags: [],
      searchTag: ""
    }
  },
  setup() {
    return {
      db,
    };
  },
  mounted() {
    this.loading = true;
    this.getAllTags();
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

    getBookFromTag: function(tag) {
      this.db.books.filter(
        (book) => {
          console.log(book.tags);
          return book.tags.includes(tag);
        }
      ).toArray().then(
          (response) => {
            this.booksList = response;
          }
      );
    },

    async getAllTags() {
      let allTags = [];

      const allBook = await this.db.books.toArray();
      allBook.forEach(
        (book) => {
          book.tags.forEach(
              (tag) => {
                allTags.push(tag);
              }
          )
        }
      );

      allTags = allTags.filter(this.onlyUnique);
      this.allTags = allTags;
    },

    onlyUnique: function(value, index, self) {
      return self.indexOf(value) === index;
    },

    onChange(event) {
      const selectValue = event.target.value;
      if(selectValue === "all") {
        this.getAllBooksFromDatabase();
      }else {
        this.getBookFromTag(selectValue);
      }
    }
  }
}
</script>

<style scoped>

</style>
