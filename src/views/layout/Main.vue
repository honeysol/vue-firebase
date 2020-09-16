<template>
  <div class="Main">
    <div class="sideColumn">
      <Side />
    </div>
    <div class="mainColumn">
      <transition :name="transitionName">
        <router-view class="child-view"></router-view>
      </transition>
    </div>
  </div>
</template>
<script lang="ts">
import Vue from "vue";
import { authentication } from "@/stores";
import Side from "./Side.vue";
import "./main.scss";
import { Route } from "vue-router";

export default Vue.extend({
  name: "SharedFruitListItem",
  components: { Side },
  data() {
    return {
      authentication,
      transitionName: "fade"
    };
  },
  watch: {
    $route(to: Route, from: Route) {
      if (to.path.startsWith(from.path)) {
        this.transitionName = "slide-left";
      } else if (from.path.startsWith(to.path)) {
        this.transitionName = "slide-right";
      } else {
        this.transitionName = "fade";
      }
    }
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
  height: 100%;
}
.sideColumn {
  height: 100%;
  position: fixed;
  background: #333;
  color: #fff;
  width: $sidebarWidth;
  top: 0;
  overflow-y: auto;
  z-index: 1;
  height: 100%;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.75s ease;
}
.fade-enter,
.fade-leave-active {
  opacity: 0;
}
.child-view {
  position: absolute;
  transition: all 0.75s cubic-bezier(0.55, 0, 0.1, 1);
  width: 100%;
  height: 100%;
}

$slideWidth: 100px;
.slide-left-enter,
.slide-right-leave-active {
  opacity: 0;
  -webkit-transform: translate($slideWidth, 0);
  transform: translate($slideWidth, 0);
}
.slide-left-leave-active,
.slide-right-enter {
  opacity: 0;
  -webkit-transform: translate(-slideWidth, 0);
  transform: translate(-slideWidth, 0);
}
</style>
