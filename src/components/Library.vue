<template>
  <div class="container">

    <nav class="panel">
      <p class="panel-heading">
        Ma bibliothèque
      </p>
      <div class="panel-filters">
        <div class="panel-tabs">
          <a @click="availableInput=undefined; onSearch()" :class="availableInput === undefined ? 'is-active' : ''">Tous</a>
          <a @click="availableInput=true; onSearch()" :class="availableInput === true ? 'is-active' : ''">Disponible</a>
          <a @click="availableInput=false; onSearch()" :class="availableInput === false ? 'is-active' : ''">Indisponible</a>
        </div>
        <div class="panel-tabs field has-addons">
          <div class="control has-icons-left" style="width: 100%">
            <input class="input" type="text" placeholder="Rechercher dans ma bibliothèque" v-model="searchInput">
            <span class="icon is-left">
            <i class="fas fa-search" aria-hidden="true"></i>
          </span>
          </div>
          <div class="control">
            <a class="button is-info" @click="onSearch()">
              Search
            </a>
          </div>
        </div>
        <div class="panel-tabs">
          <a @click="readInput=undefined; onSearch()" :class="readInput === undefined ? 'is-active' : ''">Tous</a>
          <a @click="readInput=true; onSearch()" :class="readInput === true ? 'is-active' : ''">Lu</a>
          <a @click="readInput=false; onSearch()" :class="readInput === false ? 'is-active' : ''">Non Lu</a>
        </div>
        <div v-if="allTags && allTags.length > 0" class="tag-filter">
          <label>Filtrer par tags </label>
          <select v-model="searchTag" @change="onSearch()" >
            <option selected value="all"> Tous </option>
            <option v-for="tag in allTags" :key="tag" :value="tag">{{ tag }}</option>
          </select>
        </div>
      </div>

      <div class="panel-elements">
        <BookList :booksList="booksList"></BookList>
      </div>
    </nav>
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
      console.log('onSearch');
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
  .tag-filter {
    margin-top: 1em;
    margin-bottom: .5em;
  }
  .panel-heading{
    margin-bottom: .5em;
  }
  .panel {
    min-height: 85vh;
  }
  .panel-elements {
    padding: 1em;
  }
  .panel-filters {
    padding-left: 1em;
    padding-right: 1em;
  }
</style>
