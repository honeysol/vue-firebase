<template>
  <div class="loading">
    <div class="spinner-border" role="status">
      <span class="sr-only">Loading...</span>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { authentication } from "@/stores";

export default Vue.extend({
  async created() {
    const status = await authentication.getStatus();
    if (status === "member") {
      this.$router.replace({
        path: (this.$route.query.redirect as string) || "/"
      });
    } else if (status === "guest") {
      this.$router.replace({
        path: "/signIn",
        query: this.$route.query
      });
    }
  }
});
</script>
<style lang="scss" scoped>
.loading {
  height: 100%;

  .spinner-border {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    margin: auto;
  }
}
</style>
<style lang="scss" scoped>
.componentRoot {
  max-width: 400px;
  margin: 10px auto;
}
.btn {
  margin: 0 4px;
  line-height: 1em;
}
</style>
