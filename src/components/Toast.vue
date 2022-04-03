<template>
  <p>Toast</p>
  <div v-if="toastService && toastService.toastList && toastService.toastList.length > 0">
    <div
        v-for="(toast, index)  in toastService.toastList"
        :key="toast"
        class="notification"
        :class="toast.class"
        :style="toastService.toastStackCSS[index]">
      <button class="delete" @click="onDeleteToast(toast)"></button>
      {{ toast.message }}
    </div>
  </div>
</template>

<script>
import ToastService from "../services/toastService";

export default {
  data() {
    return {
      name: "Toast",
      toastService: {}
    }
  },
  mounted() {
    this.toastService = ToastService.getInstance();
  },
  methods: {
    onDeleteToast: function(toast) {
      this.toastService.remove(toast);
    },
  }
}
</script>

<style scoped>
  .notification {
    position: fixed;
    right: 1em;
    padding-bottom: 1em;
    z-index: 9999;
  }
</style>
