<template>
  <div class="home-content">
    <div>
      <img src="../assets/bigLogo.png" alt="">
    </div>
    <div>
      <router-link class="home-button button" to="/search">
        Commencer
      </router-link>
    </div>
  </div>
</template>

<script>
export default {
  name: "Home.vue"
}
</script>

<style scoped>
  .home-content {
    display: block;
    text-align: center;
  }
  .home-button {
    background-color: #A29C43;
    color: white;
  }
</style>
