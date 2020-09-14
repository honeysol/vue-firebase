<template>
  <div>
    <div class="mainHeader">User Fruit</div>
    <div class="mainContent">
      <form>
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
          @click="save()"
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
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import dayjs from "dayjs";
import { firestore } from "firebase/app";
import firebaseProject from "@/common/firebaseProject";
import { UserFruit } from "@/models/userFruit";
import { Collection } from "@/stores/collection";
import { Document } from "@/stores/document";
import { autoclose } from "@/mixins/autoclose";
import authentication from "@/stores/authentication";

const db = firebaseProject.firestore();

export default Vue.extend<
  { authentication: typeof authentication },
  {},
  { collection: Collection<UserFruit>; document: Document<UserFruit> }
>({
  name: "UserFruitItem",
  mixins: [autoclose],
  created() {
    console.log("created", this);
  },
  data() {
    return {
      authentication
    };
  },
  computed: {
    collection() {
      return new Collection(
        db.collection("userFruit") as firestore.CollectionReference<UserFruit>,
        {
          restriction: {
            userId: this.authentication.userId
          }
        }
      );
    },
    document() {
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
