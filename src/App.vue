<template>
  <div id="app">
    <router-view />
    <Modal />
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Modal from "@/services/modal/Modal.vue";
import "./app.scss";

export default Vue.extend({
  name: "App",
  components: { Modal }
});
</script>
