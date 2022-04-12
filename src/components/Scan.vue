<template>
  <div class="header">
    <h2>Scannez le code barre d'un livre !</h2>
  </div>
  <div></div>
</template>

<script>
import { BarcodeScanner, SupportedFormat } from '@capacitor-community/barcode-scanner';

export default {
  name: "Scan",
  data() {
    return {
      result: '',
      scanActive: false,
    }
  },
  methods: {
    async startScan() {
      const result = await BarcodeScanner.startScan({ targetedFormats: [SupportedFormat.EAN_13] }); // start scanning and wait for a result

      // if the result has content
      if (result.hasContent) {
        if (this.checkBarCode(result.content)) {
          await this.$router.replace('/details/'+result.content)
        } else {
          alert("Le code barre n'est pas reconnu !")
        }
      }
    },
    stopScan() {
      BarcodeScanner.showBackground();
      BarcodeScanner.stopScan();
    },
    checkBarCode(barcode) {
      const regex = /97[89][0-9]{10}/
      return regex.test(barcode)
    }
  },
  mounted() {
    this.startScan();
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
  .header {
    width: 100%;
    padding: 1em .2em .2em .2em;
    background-color: rgba(0, 0, 0, 0.5);
    margin-top: -1em;
    text-align: center;
  }
</style>
