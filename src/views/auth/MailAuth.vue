<template>
  <div class="componentRoot">
    <form>
      <div class="form-group">
        <label>Input New Password</label>
        <input
          type="password"
          class="form-control"
          :class="document.password && 'isEditing'"
          v-model="document.password"
        />
      </div>
      <button type="button" class="btn btn-primary" @click="changePassword()">
        OK
      </button>
    </form>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import authentication from "@/stores/authentication";

class ChangePasswordData {
  password: string | null = null;
}

export default Vue.extend({
  name: "SampleListItem",
  components: {},
  props: {},
  data() {
    return {
      document: new ChangePasswordData(),
      authentication
    };
  },
  computed: {},
  async created() {
    await this.authentication.mailAuth({ url: location.href });
  },
  methods: {
    async changePassword() {
      if (this.document.password) {
        await this.authentication.updatePassword({
          password: this.document.password
        });
        this.$router.push("/signIn");
      }
    }
  }
});
</script>
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
