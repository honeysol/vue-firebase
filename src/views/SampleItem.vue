<template>
  <div>
    <div class="mainHeader">Sample</div>
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
          <label>Title</label>
          <input
            class="form-control"
            :class="document.editing && document.editing.title && 'isEditing'"
            :value="document.effective.title"
            @input="document.update('title', $event.target.value)"
          />
        </div>
        <div class="form-group">
          <label>Text</label>
          <input
            class="form-control"
            :class="document.editing && document.editing.text && 'isEditing'"
            :value="document.effective.text"
            @input="document.update('text', $event.target.value)"
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
          @click="$router.push({ name: 'SampleList' })"
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
import { Sample } from "@/models/sample";
import { Collection } from "@/stores/collection";
import { autoclose } from "@/mixins/autoclose";
const db = firebaseProject.firestore();
const collection = new Collection<Sample>(db.collection("publicDocuments"));

export default Vue.extend({
  name: "SampleItem",
  mixins: [autoclose],
  created() {
    console.log("created", this);
  },
  computed: {
    document() {
      const documentId = this.$route.params.id;
      return collection.doc(documentId, {
        defaultValue: { text: "default sample" },
        afterSave: ({ newId }) => {
          if (newId) {
            this.$router.replace({
              name: "SampleItem",
              params: { id: newId }
            });
          }
        },
        afterRemove: () => {
          this.$router.push({ name: "SampleList" });
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
