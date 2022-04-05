<template>
  <div class="field has-addons">
    <div class="control">
      <input class="input" type="search" placeholder="Search by keyWord" v-model="searchInput">

    </div>
    <div class="control">
      <a class="button is-info" @click="onSearch()">
        Search
      </a>
    </div>
  </div>

  <div class="control">
    <label class="radio">
      <input type="radio" name="read" v-model="readInput" :value="false" @change="onSearch()">
      Non lu
    </label>
    <label class="radio">
      <input type="radio" name="read" v-model="readInput" :value="undefined" @change="onSearch()" checked>
      Tous
    </label>
    <label class="radio">
      <input type="radio" name="read"  v-model="readInput" :value="true" @change="onSearch()">
      Lu
    </label>
  </div>

  <div class="control">
    <label class="radio">
      <input type="radio" name="available" v-model="availableInput" :value="false" @change="onSearch()">
      Indisponible
    </label>
    <label class="radio">
      <input type="radio" name="available" v-model="availableInput" :value="undefined" @change="onSearch()" checked>
      Tous
    </label>
    <label class="radio">
      <input type="radio" name="available"  v-model="availableInput" :value="true" @change="onSearch()">
      Disponnible
    </label>
  </div>

  <div v-if="allTags && allTags.length > 0">
    <label>Search by tag</label>
    <select v-model="searchTag" @change="onSearch()">
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
import BookPreview from "./BookPreview";
import ToastService from "../services/toastService";
import { DexieService } from "../services/dexieService"

export default {
  name: "Library.vue",
  components: {BookPreview},
  data() {
    return {
      booksList: [],
      loading: false,
      allTags: [],
      searchTag: "all",
      searchInput: "",
      readInput: undefined,
      availableInput: undefined,
      toastService: {},
      dexieService: new DexieService()
    }
  },
  mounted() {
    this.toastService = ToastService.getInstance();
    this.loading = true;
    this.getAllTags();
    this.onSearch();
  },
  methods: {
    resetSearch: function() {
      this.searchTag = 'all';
      this.searchInput = '';
      this.getAllBooksFromDatabase();
    },

    showBooksDetails(bookISBN) {
      this.$router.push({
        name: "Details",
        params: { id: bookISBN },
      });
    },

    async getAllTags() {
      let allTags = [];

      const allBook = await this.dexieService.getAllBooks();
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

    onSearch: function() {
      const searchKeyWord = this.searchInput;
      const tag = this.searchTag;
      const available = this.availableInput;
      const read = this.readInput;

      console.log("onSearch : " + searchKeyWord);
      this.dexieService.getBooksByFilters(searchKeyWord, available, read, tag).then(
          (response) => {
            this.booksList = response;
            if(response.length === 0) {
              this.toastService.show("Aucun livre trouvé", "is-warning")
            }
          }
      );
    },

  }
}
</script>

<style scoped>

</style>
