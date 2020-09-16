<template>
  <div>
    <div class="mainHeader">Shared Fruit</div>
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
            @click="$router.push({ name: 'SharedFruitList' })"
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
import { SharedFruit } from "@/models/sharedFruit";
import { Collection } from "@/stores/collection";
import { Document } from "@/stores/document";
import { autoclose } from "@/mixins/autoclose";
import { form } from "@/mixins/form";

const db = firebaseProject.firestore();
const collection = new Collection(
  db.collection("sharedFruit") as firestore.CollectionReference<SharedFruit>
);

export default Vue.extend({
  name: "SharedFruitItem",
  mixins: [autoclose, form],
  created() {
    console.log("created", this);
  },
  computed: {
    document(): Document<SharedFruit> {
      const documentId = this.$route.params.id;
      return collection.doc(documentId, {
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
          name: "SharedFruitItem",
          params: { id: newId }
        });
      }
    },
    async remove() {
      const { successed } = (await this.document.remove()) || {};
      if (successed) {
        this.$router.push({ name: "SharedFruitList" });
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
