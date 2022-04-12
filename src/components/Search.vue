<template>
  <div class="container">
    <div v-if="isNativePlatform" class="scanbox">
      <Scan></Scan>
    </div>
    <div v-else>

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

        <button class="button is-primary" type="submit">Submit</button>
      </form>




      <form @submit.prevent="onSearchByKeyword()">
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

        <button class="button is-primary" :class="loading ? 'is-loading' : ''" type="submit">Submit</button>
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
      loading: false
    }
  },
  mounted() {
    this.serverService = new GoogleServer();
    this.toastService = ToastService.getInstance();
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
    }
  }
}
</script>

<style scoped>

</style>
