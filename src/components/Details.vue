<template>
  <div class="container">
    <div class="columns">
      <div class="column is-half-tablet" v-if="book">
        <img v-if="book.imageLinks" class="book-cover" v-bind:src="book.imageLinks.thumbnail" alt="">
        <img v-else class="book-cover" src="../assets/book_cover_placeholder.png" alt="">
      </div>
      <div class="column is-half-tablet">
        <h2>Titre : <span v-if="book">{{ book.title }}</span></h2>
        <h3>Auteur : <span v-if="book">{{ book.authors.join(', ') }}</span></h3>
        <h3>Date de parution : <span v-if="book">{{ book.publishedDate }}</span> </h3>
        <span class="tag is-info" v-for="tag in tags" :key="tags.indexOf(tag)">
          {{ tag }}
          <button class="delete is-small"></button>
        </span>
        <h3>Description : </h3>
        <p v-if="book">{{ book.description }}</p>
        
        <star-rating v-model:rating="selfRate" :increment="0.5"/>
        <div v-if="book">
          <div v-if="book.ratingsCount && book.ratingsCount > 0">
            <p>{{ book.ratingsCount }} avis </p>
            <star-rating v-model:rating="book.averageRating" :star-size="20" :round-start-rating="false" :read-only="true"></star-rating>
          </div>
          <div v-else>
            <p>pas d'avis pour le moment </p>
            <star-rating v-model:rating="book.averageRating" :star-size="20" :round-start-rating="false" :read-only="true"></star-rating>
          </div>
        </div>


        <div class="field">
          <label class="label">Avis</label>
          <div class="field-body">
            <div class="field">
              <div class="control">
                <textarea v-if="review" class="textarea" :value="review"></textarea>
                <textarea v-else class="textarea" placeholder="Comment avez-vous trouvé ce livre ?"></textarea>
              </div>
            </div>
          </div>
        </div>
        <div class="field ">
          <div class="field-body">
            <div class="field">
              <div class="control">
                <button class="button is-danger">
                  Annuler
                </button>
                <button @click="onValidateForm" class="button is-primary">
                  Sauvegarder
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import StarRating from "vue-star-rating";
import axios from "axios";

export default {
  name: "Details.vue",
  props: {
    id: String
  },
  components: {
    StarRating,
  },
  data() {
    return {
      book: null,

      tags: [
        "Sport",
        "Autobiographie"
      ],
      status: "over",
      selfRate: 4,
      review: "",
      available: false,
      note: "prêté au voisin",
    }
  },
  mounted() {
    axios
        .get("https://www.googleapis.com/books/v1/volumes?q=isbn:"+this.id)
        .then((response) => {
          axios
            .get(response.data.items[0].selfLink)
            .then((responseBook) => {
              this.book = responseBook.data.volumeInfo
            })
            .catch((error) => {
              console.log(error);
            })
        })
        .catch((error) => {
          console.log(error);
        });
  },
  methods: {
    onValidateForm: function () {
      console.log(this.rate)
    }
  }
}
</script>

<style scoped>
.container {
  margin-top: 3em;
}
  .book-cover {
    height: 100%;
    max-height: 30em;
  }
  .tag {
    margin-right: 1em;
  }
</style>