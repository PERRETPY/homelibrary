<template>
  <Menu/>
  <toast></toast>
  <div>
    <router-view />
  </div>
</template>

<script>
import Menu from "./components/Menu";
import Toast from "./components/Toast";

export default {
  name: 'App',
  components: {
    Menu,
    Toast
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
