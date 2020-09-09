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

export default Vue.extend({
  name: "SampleListItem",
  components: { Side },
  data() {
    return {
      authentication
    };
  }
});
</script>
<style lang="scss">
.mainColumn {
  .mainHeader {
    background: #f7dfcf;
    color: #8a3b06;
    padding: 10px;
    width: 100%;
    font-size: 20px;
  }
  .mainContent {
    padding: 10px;
  }
}

html,
body,
#app,
.Main,
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
