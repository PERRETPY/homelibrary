<template>
  <div class="container">
    <div v-if="isNativePlatform && !manualSearch" class="scanbox">
      <Scan @returnScanMessage="messageFromScanChild"></Scan>
    </div>
    <div v-else>
      <button class="button is-primary" @click="manualSearch=false">Scan</button>
      <form @submit.prevent="onGoClick()">
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

        <button class="button is-primary" type="submit" :disabled="!correctIsbn()">Submit</button>
      </form>




      <form @submit.prevent="goToSearchPage()">
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

        <button class="button is-primary" :class="loading ? 'is-loading' : ''" type="submit" :disabled="keywords.trim()===''">Submit</button>
      </form>


      <div v-if="gotSearchResult" class="search-result">
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
import ToastService from "../services/toastService";

export default {
  name: "Search",
  components: {
    Scan, BookList
  },
  props: {
    q: String
  },
  data() {
    return {
      isbn: null,
      validForm: true,
      keywords: '',
      booksList: [],
      gotSearchResult: false,
      isNativePlatform: Capacitor.isNativePlatform(),
      serverService: {},
      toastService: {},
      loading: false,
      manualSearch: false
    }
  },
  mounted() {
    this.serverService = new GoogleServer();
    this.toastService = ToastService.getInstance();
    if(this.q) {
      this.keywords = this.q;
      this.onSearchByKeyword();
    }
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
    correctIsbn: function() {
      const regex = /97[89][0-9]{10}/
      return regex.test(this.isbn);
    },
    async onSearchByKeyword() {
      this.loading = true;
      this.gotSearchResult = false;
      this.booksList = [];
      this.serverService.getBooksBySearch(this.keywords).then(
          (response) => {
            if(response.length > 0) {
              response.forEach(
                  (bookResponse) => {
                    let book = bookResponse.data.volumeInfo;
                    this.booksList.push(book);
                  }
              )
            }
            this.loading = false;
            if(this.booksList.length > 0) {
              this.gotSearchResult = true;
            }else {
              this.toastService.show('Pas de résultat pour cette recherche', 'is-warning')
            }
          }
        ).catch(
          () => {
            this.toastService.show('Pas de résultat pour cette recherche', 'is-warning')
            this.loading = false;
          }
      );
    },
    goToSearchPage: function() {
      this.$router.replace({
        name: "SearchQ",
        params: { q: this.keywords.trim() },
      });
      this.onSearchByKeyword();
    },
    messageFromScanChild: function(searchType) {
      if(searchType === 'manualSearch') {
        this.manualSearch = true;
      }
    }
  }
}
</script>

<style scoped>

</style>
