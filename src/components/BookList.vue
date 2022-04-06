<template>

  <div class="columns is-multiline">
    <div class="column is-half-tablet is-one-third-desktop is-one-quarter-widescreen"
         v-for="book in booksList"
         :key="book.isbn">
      <BookPreview @click="showBooksDetails(book.isbn)" :book="book"></BookPreview>
    </div>
  </div>

  <div></div>
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
    showBooksDetails(bookISBN) {
      this.$router.push({
        name: "Details",
        params: { id: bookISBN },
      });
    },
  }
}
</script>

<style scoped>

</style>
