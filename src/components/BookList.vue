<template>

  <div class="columns is-multiline">
    <div class="column is-half-tablet is-one-third-desktop is-one-quarter-widescreen"
         v-for="book in booksList"
         :key="book.isbn">
      <BookPreview class='pointer' @click='showBooksDetails(book)' :book="book"></BookPreview>
    </div>
  </div>
</template>

<script>
import BookPreview from "./BookPreview";
import ToastService from "../services/toastService";

export default {
  name: "BookList",
  components: {BookPreview},
  props: {
    booksList: {}
  },
  data() {
    return {
      toastService: {}
    }
  },
  mounted() {
    this.toastService = ToastService.getInstance();
  },
  methods: {
    showBooksDetails(book) {
      let isbn = '';
      if(book.isbn) {
        isbn = book.isbn;
      } else {
        book.industryIdentifiers.forEach(
            (identifier) => {
              if(identifier.type === 'ISBN_13') {
                isbn = identifier.identifier;
              }
            }
        );
        if(this.isbn === '') {
          this.toastService.show('Une erreur est survenue avec ce livre', 'is-danger');
        }
      }
      this.$router.push({
        name: "Details",
        params: { id: isbn },
      });
    },
  }
}
</script>

<style scoped>
  .pointer {
    cursor: pointer;
  }
</style>
