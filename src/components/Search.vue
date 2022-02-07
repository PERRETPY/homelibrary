<template>
  <div class="container">
    <div v-if="isNativePlatform" class="scanbox">
      <Scan></Scan>
    </div>
    <div v-else>
      <h3>Search</h3>
      <input type="text">
      <button>Go</button>
    </div>
  </div>
</template>

<script>
import Scan from "./Scan";
import {Capacitor} from "@capacitor/core";
export default {
  name: "Search",
  components: {
    Scan,
  },
  data() {
    return {
      isNativePlatform: Capacitor.isNativePlatform()
    }
  }
}
</script>

<style scoped>


</style>