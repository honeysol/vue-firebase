<template>
  <div class="componentRoot">
    <ValidationObserver v-slot="{ handleSubmit, failed }">
      <form
        @submit.prevent="handleSubmit(() => loading.run(signUp))"
        v-if="!completed"
      >
        <div class="form-group">
          <label>email</label>
          <ValidationProvider
            name="email"
            rules="required|email"
            v-slot="{ errors }"
          >
            <input
              class="form-control"
              :class="[
                document.email && 'isEditing',
                errors.length && 'is-invalid'
              ]"
              v-model="document.email"
            />
            <div class="invalid-feedback">
              {{ errors[0] }}
            </div>
          </ValidationProvider>
        </div>
        <div class="alert alert-danger" role="alert" v-if="errorMessage">
          {{ errorMessage }}
        </div>
        <button type="submit" class="btn btn-primary" :disabled="failed">
          <span
            v-if="loading.isLoading"
            class="spinner-border spinner-border-sm"
          ></span>

          Send Email
        </button>
        <button type="button" class="btn btn-danger" @click="discard()">
          Discard
        </button>
        <div class="alert alert-light" role="alert">
          <div><router-link to="/signIn">Sign In</router-link></div>
          <div>
            <router-link to="/signUp">Sign Up</router-link>
          </div>
        </div>
      </form>
    </ValidationObserver>
    <div class="alert alert-primary" role="alert" v-if="completed">
      A confirmation e-mail will be sent automatically to your e-mail address.
      check your mail box.
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { form } from "@/mixins";
import { authentication, Loading } from "@/stores";

class SignUpData {
  email = null as string | null;
}

export default Vue.extend({
  mixins: [form],
  data() {
    return {
      loading: new Loading(),
      document: new SignUpData(),
      authentication,
      completed: false,
      errorMessage: null as string | null | undefined
    };
  },
  methods: {
    async signUp() {
      console.log(this.document);
      if (this.document.email) {
        const response = await this.authentication.sendPasswordReset({
          email: this.document.email
        });
        console.log("response", response);
        if (response.status === "successed") {
          this.completed = true;
        } else if (response.status === "error") {
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
