<template>
  <p>Details component : {{ id }} !</p>
</template>

<script>
export default {
  name: "Details.vue",
  props: {
    id: String
  },
  data() {
    return {
      title: "Mes 10 commandements",
      authors: [
        "Kevin Mayer",
        "Nicolas Herbelot"
      ],
      publisher: "Solar",
      publishedDate: "2020",
      tags: [],
      status: "over",
      description: "Je n'ai pas grandi dans l'idée de vivre un jour de mon sport, ni fait du décathlon pour en détenir le record du monde. Il y a des enfants champions que des parents destinent à ça. Ce n'est pas mon cas.",
      rate: 4,
      review: "Super, très intéressant !",
      available: false,
      note: "prêté au voisin"
    }
  }
}
</script>

<style scoped>

</style>