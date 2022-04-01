<template>
  <div class="card">
    <div class="card-content">
      <div class="media">
        <div class="media-content">
          <p class="title is-4">{{ book.title }}</p>
          <p class="subtitle is-6">{{ book.authors.join(', ') }}</p>
        </div>
      </div>
      <div class="content">
            <span class="tag is-info" v-for="tag in book.tags" :key="book.tags.indexOf(tag)">
              {{ tag }}
            </span>
        <br>
        <br>
        <time datetime="2016-1-1">11:09 PM - 1 Jan 2016</time>
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
}
</style>
