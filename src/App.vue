<template>
  <Menu/>
  <div>
    <router-view />
  </div>
</template>

<script>
import Menu from "./components/Menu";

export default {
  name: 'App',
  components: {
    Menu
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
