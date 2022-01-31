<template>
  <div class="container">
    <div class="columns">
      <div class="column is-half-tablet">
        <img class="book-cover" src="../assets/Mes-10-commandements.jpg" alt="">
      </div>
      <div class="column is-half-tablet">
        <h2>Titre : {{ title }}</h2>
        <h3>Auteur : {{authors.join(', ')}}</h3>
        <h3>Date de parution : {{ publishedDate }}</h3>
        <span class="tag is-info" v-for="tag in tags" :key="tags.indexOf(tag)">
          {{ tag }}
          <button class="delete is-small"></button>
        </span>
        <h3>Description : </h3>
        <p>{{ description }}</p>
        
      <star-rating v-model:rating="rate" :increment="0.5"/>

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
      mouseOverRating: null,

      title: "Mes 10 commandements",
      authors: [
        "Kevin Mayer",
        "Nicolas Herbelot"
      ],
      publisher: "Solar",
      publishedDate: "2020",
      tags: [
        "Sport",
        "Autobiographie"
      ],
      status: "over",
      description: "Je n'ai pas grandi dans l'idée de vivre un jour de mon sport, ni fait du décathlon pour en détenir le record du monde. Il y a des enfants champions que des parents destinent à ça. Ce n'est pas mon cas.",
      rate: 4,
      review: "",
      available: false,
      note: "prêté au voisin",
    }
  },
  methods: {
    onValidateForm: function () {
      console.log(this.rate)
    }
  }
}
</script>

<style scoped>
  .book-cover {
    height: 100%;
  }
  .tag {
    margin-right: 1em;
  }
</style>