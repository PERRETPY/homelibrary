<template>
  <div class="container">
    <div v-if="isNativePlatform" class="scanbox">
      <Scan></Scan>
    </div>
    <div v-else>

      <div class="field">
        <label class="label">Rechercher un livre</label>
        <div class="control">
          <input
              class="input"
              v-bind:class="{ 'is-danger': !validForm }"
              v-model="isbn"
              type="text"
              placeholder="ISBN">
        </div>
        <p v-if="!validForm" class="help is-danger">This ISBN is not correct</p>
      </div>

      <button class="button is-primary" @click="onGoClick">Submit</button>
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
      isbn: null,
      validForm: true,
      isNativePlatform: Capacitor.isNativePlatform()
    }
  },
  methods: {
    onGoClick: function () {
      console.log(this.isbn)
      const regex = /97[89][0-9]{10}/
      if ( regex.test(this.isbn) ) {
        this.validForm = true;
        this.$router.replace({ path: '/details/'+this.isbn })
      } else {
        this.validForm = false;
        console.log(this.validForm)
      }
    }
  }
}
</script>

<style scoped>
  .test {
    background-color: red;
  }

</style>