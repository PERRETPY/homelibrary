<template>
  <div class="container">
    <div v-if="isNativePlatform" class="scanbox">
      <Scan></Scan>
    </div>
    <div v-else>

      <div class="field">
        <label class="label">Rechercher un livre</label>
        <div class="control">
          <input
              class="input"
              v-bind:class="{ 'is-danger': !validForm }"
              v-model="isbn"
              type="text"
              placeholder="ISBN">
        </div>
        <p v-if="!validForm" class="help is-danger">This ISBN is not correct</p>
      </div>

      <button class="button is-primary" @click="onGoClick">Submit</button>




      <div class="field">
        <label class="label">Rechercher un livre</label>
        <div class="control">
          <input
              class="input"
              v-bind:class="{ 'is-danger': !validForm }"
              v-model="keywords"
              type="text"
              placeholder="Recherche par mots clés">
        </div>
      </div>

      <button class="button is-primary" @click="onSearchByKeyword()">Submit</button>

      <div v-if="gotSearchResult" class="search-result">
        <h2>résultat</h2>
        <BookList :booksList="booksList"></BookList>
      </div>

    </div>
  </div>
</template>

<script>
import Scan from "./Scan";
import {Capacitor} from "@capacitor/core";
import BookList from "./BookList";
import {GoogleServer} from "../services/ServerService";

export default {
  name: "Search",
  components: {
    Scan, BookList
  },
  data() {
    return {
      isbn: null,
      validForm: true,
      keywords: '',
      booksList: [],
      gotSearchResult: false,
      isNativePlatform: Capacitor.isNativePlatform(),
      serverService: {}
    }
  },
  mounted() {
    this.serverService = new GoogleServer();
  },
  methods: {
    onGoClick: function () {
      const regex = /97[89][0-9]{10}/
      if ( regex.test(this.isbn) ) {
        this.validForm = true;
        this.$router.replace({ path: '/details/'+this.isbn })
      } else {
        this.validForm = false;
      }
    },
    async onSearchByKeyword() {
      this.serverService.getBooksBySearch(this.keywords).then(
          (response) => {
            response.forEach(
                (bookResponse) => {
                  let book = bookResponse.data.volumeInfo;
                  this.booksList.push(book);
              }
            )
            this.gotSearchResult = true;
          }
      );
    }
  }
}
</script>

<style scoped>

</style>
