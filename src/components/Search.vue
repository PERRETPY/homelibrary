<template>
  <div class="container">

    <div class="content-page">
      <div v-if="isNativePlatform && !manualSearch" class="scanbox">
        <Scan @returnScanMessage="messageFromScanChild"></Scan>
      </div>
      <div v-else>
        <button v-if="isNativePlatform" class="button is-primary" @click="manualSearch=false">Scan</button>
        <h5 class="title is-5">Rechercher un livre</h5>
        <form @submit.prevent="onGoClick()">
          <div class="field has-addons">
            <div class="control is-expanded">
              <input
                  class="input available-input"
                  v-bind:class="{ 'is-danger': !validForm }"
                  v-model="query"
                  type="text"
                  placeholder="ISBN ou mots clés">
            </div>
            <div class="control">
              <button class="button is-primary" :class="loading ? 'is-loading' : ''" type="submit" :disabled="query.trim()===''">Rechercher</button>
            </div>
          </div>
        </form>

        <div v-if="gotSearchResult" class="search-result">
          <BookList :booksList="booksList"></BookList>
        </div>

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
      query: '',
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
      this.query = this.q;
      this.onSearchByKeyword();
    }
  },
  methods: {
    onGoClick: function () {
      const regex = /97[89][0-9]{10}/
      if ( regex.test(this.query) ) {
        this.validForm = true;
        this.$router.replace({ path: '/details/'+this.query })
      } else {
        this.goToSearchPage();
      }
    },
    async onSearchByKeyword() {
      this.loading = true;
      this.gotSearchResult = false;
      this.booksList = [];
      this.serverService.getBooksBySearch(this.query).then(
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
        params: { q: this.query.trim() },
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
  .content-page {
    margin: 1em;
  }
  .search-result {
    margin-top: 2em;
  }
</style>
