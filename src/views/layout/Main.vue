<template>
  <div class="Main">
    <div class="sideColumn">
      <Side />
    </div>
    <div class="mainColumn">
      <router-view></router-view>
    </div>
  </div>
</template>
<script lang="ts">
import Vue from "vue";
import Side from "./Side.vue";
import authentication from "@/stores/authentication";
import "./main.scss";

export default Vue.extend({
  name: "CommonFruitListItem",
  components: { Side },
  data() {
    return {
      authentication
    };
  }
});
</script>
<style lang="scss"></style>

<style scoped lang="scss">
$sidebarWidth: 200px;
.mainColumn {
  left: $sidebarWidth;
  position: absolute;
  width: calc(100% - #{$sidebarWidth});
}
.sideColumn {
  height: 100%;
  position: fixed;
  background: #333;
  color: #fff;
  width: $sidebarWidth;
  top: 0;
  overflow-y: auto;
}
</style>
