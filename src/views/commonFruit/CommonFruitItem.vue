<template>
  <div>
    <div class="mainHeader">CommonFruit</div>
    <div class="mainContent">
      <form>
        <div class="form-group">
          <label>ID</label>
          <input class="form-control" readonly :value="document.id" />
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
          <input
            class="form-control"
            :class="document.edited('name') && 'isEditing'"
            v-model="document.effective.name"
          />
        </div>
        <div class="form-group">
          <label>Description</label>
          <input
            class="form-control"
            :class="document.edited('description') && 'isEditing'"
            v-model="document.effective.description"
          />
        </div>
        <div class="form-group">
          <label>Color</label>
          <input
            class="form-control"
            :class="document.edited('color') && 'isEditing'"
            v-model="document.effective.color"
          />
        </div>

        <button
          :disabled="!document.canSave"
          type="button"
          class="btn btn-primary"
          @click="document.save()"
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
          @click="document.remove()"
        >
          Delete
        </button>
        <button
          type="button"
          class="btn btn-secondary"
          @click="$router.push({ name: 'CommonFruitList' })"
        >
          Back
        </button>
      </form>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import dayjs from "dayjs";
import firebaseProject from "@/common/firebaseProject";
import { CommonFruit } from "@/models/commonFruit";
import { Collection } from "@/stores/collection";
import { autoclose } from "@/mixins/autoclose";
import { firestore } from "firebase/app";
const db = firebaseProject.firestore();
const collection = new Collection<CommonFruit>(
  db.collection("publicDocuments") as firestore.CollectionReference<CommonFruit>
);

export default Vue.extend({
  name: "CommonFruitItem",
  mixins: [autoclose],
  created() {
    console.log("created", this);
  },
  computed: {
    document() {
      const documentId = this.$route.params.id;
      return collection.doc(documentId, {
        defaultValue: { description: "default description" },
        afterSave: ({ newId }) => {
          if (newId) {
            this.$router.replace({
              name: "CommonFruitItem",
              params: { id: newId }
            });
          }
        },
        afterRemove: () => {
          this.$router.push({ name: "CommonFruitList" });
        }
      });
    }
  },
  methods: {
    formatDate(timestamp: number) {
      return dayjs(timestamp).format("YYYY-MM-DD HH:mm:ss");
    }
  },
  autoclose: ["document"]
});
</script>
<style lang="scss" scoped>
.isEditing {
  background: #fee;
}
.btn {
  margin: 4px;
}
form {
  margin: 10px;
  max-width: 400px;
}
</style>
