<template>
  <div class="componentRoot">
    <ValidationObserver v-slot="{ handleSubmit, failed }">
      <form @submit.prevent="handleSubmit(() => loading.run(changePassword))">
        <div class="form-group">
          <label>Input New Password</label>
          <ValidationProvider
            name="Password"
            rules="required"
            v-slot="{ errors }"
          >
            <input
              type="password"
              class="form-control"
              :class="[
                document.password && 'isEditing',
                errors.length && 'is-invalid'
              ]"
              v-model="document.password"
            />
            <div class="invalid-feedback">
              {{ errors[0] }}
            </div>
          </ValidationProvider>
        </div>
        <button type="submit" class="btn btn-primary" :disabled="failed">
          <span
            v-if="loading.isLoading"
            class="spinner-border spinner-border-sm"
          ></span>
          OK
        </button>
      </form>
    </ValidationObserver>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { form } from "@/mixins";
import { authentication, Loading } from "@/stores";

class ChangePasswordData {
  password: string | null = null;
}

export default Vue.extend({
  mixins: [form],
  data() {
    return {
      loading: new Loading(),
      document: new ChangePasswordData(),
      authentication
    };
  },
  async created() {
    await this.authentication.mailAuth({ url: location.href });
  },
  methods: {
    async changePassword() {
      if (this.document.password) {
        await this.authentication.updatePassword({
          password: this.document.password
        });
        this.$router.push("/");
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
