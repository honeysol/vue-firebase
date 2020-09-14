<template>
  <div>
    <div class="logo">
      <router-link :to="{ name: 'Top' }"> Top</router-link>
    </div>
    <div class="menuItem">
      <router-link :to="{ name: 'SharedFruitList' }" active-class="active">
        <i class="fas fa-share"></i>
        Shared Fruits
      </router-link>
    </div>
    <div class="menuItem">
      <router-link :to="{ name: 'UserFruitList' }" active-class="active">
        <i class="fas fa-share"></i>
        User Fruits
      </router-link>
    </div>
    <div class="menuItem">
      <router-link :to="{ name: 'About' }" active-class="active">
        <i class="fas fa-share"></i>
        About
      </router-link>
    </div>
    <div class="menuItem">
      <router-link :to="{ name: 'SignOut' }" active-class="active">
        <i class="fas fa-share"></i>
        Sign Out
      </router-link>
    </div>
  </div>
</template>
<script lang="ts">
import Vue from "vue";
import authentication from "@/stores/authentication";

export default Vue.extend({
  name: "Side",
  data() {
    return {
      authentication
    };
  }
});
</script>
<style lang="scss" scoped>
.logo {
  padding: 10px 20px;
  font-size: 20px;
  a {
    color: #fff;
    text-decoration: none;
  }
}
.menuItem {
  font-size: 16px;
  i {
    font-size: 18px;
    margin-right: 5px;
  }
  a {
    display: block;
    padding: 10px 20px;
    color: #eee;
    border-radius: 3px;
    cursor: pointer;
    text-decoration: none;
    &:hover {
      background: #666;
      color: #fff;
    }
    &:active {
      background: #999;
    }
    &.active {
      color: #333;
      background: #ccc;
    }
  }
}
</style>
