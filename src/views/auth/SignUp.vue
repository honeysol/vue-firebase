<template>
  <div class="componentRoot">
    <form v-if="!completed">
      <div class="form-group">
        <label>email</label>
        <input
          class="form-control"
          :class="document.email && 'isEditing'"
          v-model="document.email"
        />
      </div>
      <div class="alert alert-danger" role="alert" v-if="errorMessage">
        {{ errorMessage }}
      </div>
      <button type="button" class="btn btn-primary" @click="signUp()">
        Register
      </button>
      <button type="button" class="btn btn-danger" @click="discard()">
        Discard
      </button>
      <div class="alert alert-light" role="alert">
        <div><router-link to="/signIn">Sign In</router-link></div>
        <div>
          <router-link to="/passwordReset">Password Reset</router-link>
        </div>
      </div>
    </form>
    <div class="alert alert-primary" role="alert" v-if="completed">
      A confirmation e-mail will be sent automatically to your e-mail address.
      check your mail box.
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import authentication from "@/stores/authentication";

class SignUpData {
  email: string | null = null;
}

export default Vue.extend({
  name: "SampleListItem",
  components: {},
  props: {},
  data() {
    return {
      document: new SignUpData(),
      authentication,
      completed: false,
      errorMessage: null as string | null | undefined
    };
  },
  computed: {},
  methods: {
    async signUp() {
      console.log(this.document);
      if (this.document.email) {
        const response = await this.authentication.signUp({
          email: this.document.email
        });
        console.log("response", response);
        if (response.status === "successed") {
          this.completed = true;
        } else {
          this.errorMessage = response.errorMessage;
        }
      }
    },
    discard() {
      this.document = new SignUpData();
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
