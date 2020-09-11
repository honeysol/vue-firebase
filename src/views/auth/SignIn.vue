<template>
  <div class="componentRoot">
    <form>
      <div class="form-group">
        <label>email</label>
        <input
          class="form-control"
          :class="document.email && 'isEditing'"
          v-model="document.email"
        />
      </div>
      <div class="form-group">
        <label>Password</label>
        <input
          type="password"
          class="form-control"
          :class="document.password && 'isEditing'"
          v-model="document.password"
        />
      </div>
      <div class="alert alert-danger" role="alert" v-if="errorMessage">
        {{ errorMessage }}
      </div>
      <button type="button" class="btn btn-primary" @click="signIn()">
        Login
      </button>
      <button type="button" class="btn btn-danger" @click="discard()">
        Discard
      </button>
      <div class="alert alert-light" role="alert">
        <div><router-link to="/signUp">Sign Up</router-link></div>
        <div><router-link to="/passwordReset">Password Reset</router-link></div>
      </div>
    </form>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import authentication from "@/stores/authentication";

class SignInData {
  email: string | null = null;
  password: string | null = null;
}

export default Vue.extend({
  name: "SampleListItem",
  components: {},
  props: {},
  data() {
    return {
      document: new SignInData(),
      authentication,
      errorMessage: null as string | null | undefined
    };
  },
  computed: {},
  methods: {
    async signIn() {
      console.log(this.document);
      if (this.document.email && this.document.password) {
        const response = await this.authentication.signIn({
          email: this.document.email,
          password: this.document.password
        });
        if (response.status === "successed") {
          this.$router.replace({
            path: (this.$route.query.redirect as string) || "/"
          });
        } else {
          this.errorMessage = response.errorMessage;
        }
      }
    },
    discard() {
      this.document = new SignInData();
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
