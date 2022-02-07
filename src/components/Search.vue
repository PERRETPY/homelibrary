<template>
  <div class="container">
    <div class="scanbox">
      <div></div>
    </div>
  </div>
</template>

<script>
import { BarcodeScanner } from '@capacitor-community/barcode-scanner';
import { Capacitor } from '@capacitor/core';

export default {
  name: "Search",
  data() {
    return {
      result: '',
      scanActive: false,
      isNativePlatform: Capacitor.isNativePlatform()
    }
  },
  methods: {
    async startScan() {
      await BarcodeScanner.hideBackground(); // make background of WebView transparent

      const result = await BarcodeScanner.startScan(); // start scanning and wait for a result

      // if the result has content
      if (result.hasContent) {
        console.log(result.content); // log the raw scanned content
        await this.$router.replace('/details/'+result.content)
      }
    },
    stopScan() {
      BarcodeScanner.showBackground();
      BarcodeScanner.stopScan();
    },
  },
  mounted() {
    if (this.isNativePlatform) {
      this.startScan();
    }
  },
  deactivated() {
    this.stopScan();
  },

  beforeUnmount() {
    this.stopScan();
  },
}

</script>

<style scoped>

  .scanbox {
    width: 50%;
    height: 10em;
    border: solid black .1em;
  }
</style>