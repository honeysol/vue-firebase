<template>
  <div class="">
    <a @click="clear" v-if="url">Clear</a>
    <input @change="change" type="file" class="form-control-file" />
    <img :src="url" style="width: 100%" />
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { file } from "@/mixins";

export default Vue.extend({
  mixins: [file]
});
</script>

<style scoped lang="scss"></style>
