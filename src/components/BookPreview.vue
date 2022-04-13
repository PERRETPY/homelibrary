<template>
  <div class="card">
    <header v-if="book.isbn" class="card-header">
      <p class="card-header-title">
        <i class="fa fa-book" aria-hidden="true" :style="book.read ? '' : 'color: rgba(218, 0, 0, 0.5)'"></i>
        <span v-if="book.read">Lu</span>
        <span v-else>Non lu</span>
      </p>
    </header>
    <div class="card-content" :style="book.isbn ? book.available ? 'background-color: rgba(0, 218, 0, 0.11)' : 'background-color: rgba(218, 0, 0, 0.11)' : 'background-color: rgba(185, 185, 185, 0.11)'">
      <div class="media">
        <div class="media-content">
          <p class="title is-4">{{ book.title }}</p>
          <p class="subtitle is-6" v-if="book.authors">{{ book.authors.join(', ') }}</p>
        </div>
      </div>
      <div class="content">
            <span class="tag" v-for="tag in book.tags" :key="book.tags.indexOf(tag)">
              {{ tag }}
            </span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "BookPreview",
  props: {
    book: {}
  }
}
</script>

<style scoped>
  .tag {
    margin-right: .8em;
    background-color: #A29C43;
    color: white;
  }
  .card-header {
    background-color: rgba(185, 185, 185, 0.11);
  }
  .card-content {

  }
  .fa-book {
    margin-right: 1em;
  }
</style>
