<template>
  <toast></toast>
  <button @click="resetSearch()">Reset</button>

  <form>
    <label for="search">Recherche</label>
    <input type="text" id="search" v-model="searchInput">
  </form>

  <button @click="search()">Go</button>


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
import Toast from "./Toast";
import ToastService from "../services/toastService";

export default {
  name: "Library.vue",
  components: {Toast, BookPreview},
  data() {
    return {
      booksList: [],
      loading: false,
      allTags: [],
      searchTag: "all",
      searchInput: "",
      toastService: {}
    }
  },
  setup() {
    return {
      db,
    };
  },
  mounted() {
    this.toastService = ToastService.getInstance();
    this.loading = true;
    this.getAllTags();
    this.getAllBooksFromDatabase();
  },
  methods: {
    resetSearch: function() {
      this.searchTag = 'all';
      this.searchInput = '';
      this.getAllBooksFromDatabase();
    },

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
    },

    search: function() {
      const search = this.searchInput;
      console.log("onSearch : " + search);
      this.db.books.filter(
          (book) => {
            if(book.tags.includes(search)) {
              console.log(book + " matches the search with tags");
              return true;
            }
            if(book.authors.includes(search)) {
              console.log(book + " matches the search with authors");
              return true;
            }
            if(book.title.includes(search)) {
              console.log(book + " matches the search with title");
              return true;
            }
          }
      ).toArray().then(
          (response) => {
            this.booksList = response;
          }
      );
    },

    filterBookArrayByRead: function(isRead) {
      this.booksList.forEach(
          (book, index) => {
            if(book.read !== isRead) {
              this.booksList.splice(index, 1);
            }
          }
      );
    },

    filterBookArrayByAvailable: function(isAvailable) {
      this.booksList.forEach(
          (book, index) => {
            if(book.available !== isAvailable) {
              this.booksList.splice(index, 1);
            }
        }
      );
    },

  }
}
</script>

<style scoped>

</style>
