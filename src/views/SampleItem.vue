<template>
  <div class="componentRoot">
    <form>
      <div class="form-group">
        <label>ID</label>
        <input class="form-control" readonly :value="document && document.id" />
      </div>
      <div class="form-group">
        <label>Update Time</label>
        <input
          class="form-control"
          readonly
          :value="
            effectiveDocument.updateTime &&
              dayjs(effectiveDocument.updateTime).format('YYYY-MM-DD HH:mm:ss')
          "
        />
      </div>
      <div class="form-group">
        <label>Title</label>
        <input
          class="form-control"
          :class="editingDocument && editingDocument.title && 'isEditing'"
          :value="effectiveDocument.title"
          @input="update('title', $event.target.value)"
        />
      </div>
      <div class="form-group">
        <label>Text</label>
        <input
          class="form-control"
          :class="editingDocument && editingDocument.text && 'isEditing'"
          :value="effectiveDocument.text"
          @input="update('text', $event.target.value)"
        />
      </div>
      <button type="button" class="btn btn-primary" @click="save()">
        Save
      </button>
      <button type="button" class="btn btn-danger" @click="remove()">
        Delete
      </button>
      <button type="button" class="btn btn-secondary" @click="discard()">
        Discard
      </button>
      <button
        type="button"
        class="btn btn-secondary"
        @click="$router.push({ name: 'SampleList' })"
      >
        Cancel
      </button>
    </form>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { firestore } from "firebase/app";
import dayjs from "dayjs";

import firebaseProject from "@/common/firebaseProject";
const db = firebaseProject.firestore();
const collection = db.collection("publicDocuments");
import { Sample } from "@/models/sample";

console.log(firestore.Timestamp);
export default Vue.extend({
  name: "SampleItem",
  components: {},
  props: {},
  data() {
    return {
      editingDocument: null as null | Sample,
      dayjs,
      collection,
      document: null as null | Sample
    };
  },
  computed: {
    effectiveDocument(): Sample {
      return { ...this.document, ...this.editingDocument };
    }
  },
  methods: {
    remove() {
      this.collection.doc(this.document?.id).delete();
      this.$router.push({ name: "SampleList" });
    },
    save() {
      this.collection
        .doc(this.document?.id)
        .update({ ...this.editingDocument, updateTime: Date.now() });
      this.editingDocument = null;
      this.$router.push({ name: "SampleList" });
    },
    discard() {
      this.editingDocument = null;
    },
    edited(fieldName: keyof Sample) {
      return this.editingDocument?.[fieldName];
    },
    update(fieldName: keyof Sample, value: number | string) {
      if (!this.editingDocument) {
        this.editingDocument = {};
      }
      Vue.set(this.editingDocument, fieldName, value);
    }
  },
  firestore() {
    return {
      document: collection.doc(this.$route.params.id)
    };
  }
});
</script>
<style lang="scss" scoped>
.isEditing {
  background: #fee;
}
.btn {
  margin: 4px;
}
.componentRoot {
  margin: 10px;
  max-width: 400px;
}
</style>
