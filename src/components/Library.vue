<template>
  <div class="container">
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
    <BookList :booksList="booksList"></BookList>
  </div>
</template>

<script>
import ToastService from "../services/toastService";
import {CapacitorStorage} from "../services/StorageService"
import {Capacitor} from "@capacitor/core";
import BookList from "./BookList";

export default {
  name: "Library.vue",
  components: {BookList},
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
      isNativePlatform: Capacitor.isNativePlatform(),
      storageService: {}
    }
  },
  mounted() {
    this.loading = true;
    this.storageService = new CapacitorStorage();
    this.toastService = ToastService.getInstance();
    this.getAllTags();
    this.onSearch();
  },
  methods: {
    resetSearch: function() {
      this.searchTag = 'all';
      this.searchInput = '';
    },

    async getAllTags() {
      let allTags = [];

      const allBook = await this.storageService.getAllBooks();
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

      this.storageService.getBooksByFilters(searchKeyWord, available, read, tag).then(
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
