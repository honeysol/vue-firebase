<template>
  <div>
    <div class="mainHeader">User Fruit</div>
    <div class="mainContent">
      <ValidationObserver v-slot="{ handleSubmit, failed }">
        <form @submit.prevent="handleSubmit(save)">
          <div class="form-group">
            <label>ID</label>
            <input class="form-control" readonly :value="document.id" />
          </div>
          <div class="form-group">
            <label>User ID</label>
            <input
              class="form-control"
              readonly
              :value="document.effective.userId"
            />
          </div>
          <div class="form-group">
            <label>Update Time</label>
            <input
              class="form-control"
              readonly
              :value="
                document.effective.updateTime &&
                  formatDate(document.effective.updateTime)
              "
            />
          </div>

          <div class="form-group">
            <label>Name</label>
            <ValidationProvider
              name="Name"
              rules="required"
              v-slot="{ errors }"
            >
              <input
                class="form-control"
                :class="[
                  document.edited('name') && 'isEditing',
                  errors.length && 'is-invalid'
                ]"
                v-model="document.effective.name"
              />
              <div class="invalid-feedback">
                {{ errors[0] }}
              </div>
            </ValidationProvider>
          </div>
          <div class="form-group">
            <label>Color</label>
            <ValidationProvider
              name="Color"
              rules="required"
              v-slot="{ errors }"
            >
              <input
                class="form-control"
                :class="[
                  document.edited('color') && 'isEditing',
                  errors.length && 'is-invalid'
                ]"
                v-model="document.effective.color"
              />
              <div class="invalid-feedback">
                {{ errors[0] }}
              </div>
            </ValidationProvider>
          </div>
          <div class="form-group">
            <label>Country of Origin (origin.country) </label>
            <ValidationProvider name="Country of Origin" v-slot="{ errors }">
              <input
                class="form-control"
                :class="[
                  document.edited('origin.country') && 'isEditing',
                  errors.length && 'is-invalid'
                ]"
                v-model="document.effective['origin.country']"
              />
              <div class="invalid-feedback">
                {{ errors[0] }}
              </div>
            </ValidationProvider>
          </div>
          <div class="form-group">
            <label>Description</label>
            <input
              class="form-control"
              :class="document.edited('description') && 'isEditing'"
              v-model="document.effective.description"
            />
          </div>
          <button
            :disabled="!document.canSave || failed"
            type="submit"
            class="btn btn-primary"
          >
            Save
          </button>
          <button
            :disabled="!document.canDiscard"
            type="button"
            class="btn btn-secondary"
            @click="document.discard()"
          >
            Discard
          </button>
          <button
            :disabled="!document.canRemove"
            type="button"
            class="btn btn-danger"
            @click="remove()"
          >
            Delete
          </button>
          <button
            type="button"
            class="btn btn-secondary"
            @click="$router.push({ name: 'UserFruitList' })"
          >
            Back
          </button>
        </form>
      </ValidationObserver>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import dayjs from "dayjs";
import { firestore } from "firebase/app";
import firebaseProject from "@/common/firebaseProject";
import { form, autoclose } from "@/mixins";
import { Collection, Document, authentication } from "@/stores";
import { UserFruit } from "@/models/userFruit";

const db = firebaseProject.firestore();

export default Vue.extend({
  name: "UserFruitItem",
  mixins: [autoclose, form],
  created() {
    console.log("created", this);
  },
  data() {
    return {
      authentication
    };
  },
  computed: {
    collection(): Collection<UserFruit> {
      return new Collection(
        db.collection("userFruit") as firestore.CollectionReference<UserFruit>,
        {
          restriction: {
            userId: this.authentication.userId
          }
        }
      );
    },
    document(): Document<UserFruit> {
      const documentId = this.$route.params.id;
      return this.collection.doc(documentId, {
        defaultValue: { description: "default description" }
      });
    }
  },
  methods: {
    formatDate(timestamp: number) {
      return dayjs(timestamp).format("YYYY-MM-DD HH:mm:ss");
    },
    async save() {
      const { newId } = (await this.document.save()) || {};
      if (newId) {
        this.$router.replace({
          name: "UserFruitItem",
          params: { id: newId }
        });
      }
    },
    async remove() {
      const { successed } = (await this.document.remove()) || {};
      if (successed) {
        this.$router.push({ name: "UserFruitList" });
      }
    }
  },
  autoclose: ["document"]
});
</script>
<style lang="scss" scoped>
.btn {
  margin: 4px;
}
form {
  margin: 10px;
  max-width: 400px;
}
</style>
