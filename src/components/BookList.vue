<template>

  <div class="columns is-multiline">
    <div class="column is-half-tablet is-one-third-desktop is-one-quarter-widescreen"
         v-for="book in booksList"
         :key="book.isbn">
      <BookPreview @click='showBooksDetails(book)' :book="book"></BookPreview>
    </div>
  </div>
</template>

<script>
import BookPreview from "./BookPreview";

export default {
  name: "BookList",
  components: {BookPreview},
  props: {
    booksList: {}
  },
  methods: {
    showBooksDetails(book) {
      let isbn = '';
      if(book.isbn) {
        isbn = book.isbn;
      } else {
        isbn = book.industryIdentifiers[1].identifier
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

</style>
