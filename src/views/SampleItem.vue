<template>
  <div class="componentRoot">
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
            effectiveDocument.updateTime &&
              formatDate(effectiveDocument.updateTime)
          "
        />
      </div>
      <div class="form-group">
        <label>Title</label>
        <input
          class="form-control"
          :class="document.editing && document.editing.title && 'isEditing'"
          :value="effectiveDocument.title"
          @input="document.update('title', $event.target.value)"
        />
      </div>
      <div class="form-group">
        <label>Text</label>
        <input
          class="form-control"
          :class="document.editing && document.editing.text && 'isEditing'"
          :value="effectiveDocument.text"
          @input="document.update('text', $event.target.value)"
        />
      </div>
      <button type="button" class="btn btn-primary" @click="document.save()">
        Save
      </button>
      <button type="button" class="btn btn-danger" @click="document.remove()">
        Delete
      </button>
      <button
        type="button"
        class="btn btn-secondary"
        @click="document.discard()"
      >
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
import dayjs from "dayjs";
import firebaseProject from "@/common/firebaseProject";
const db = firebaseProject.firestore();
const collection = db.collection("publicDocuments");
import { Sample } from "@/models/sample";
import { Document } from "@/stores/document";

export default Vue.extend({
  name: "SampleItem",
  components: {},
  props: {},
  data() {
    return {
      document: null as Document<Sample> | null
    };
  },
  created() {
    console.log("created", this);
  },
  beforeDestroy() {
    console.log("beforeDestroy");
    this.document?.close();
    // no effect
    // this.document = null;
  },
  computed: {
    documentId(): string {
      return this.$route.params.id;
    },
    effectiveDocument(): Sample {
      return { ...this.document?.data, ...this.document?.editing };
    }
    // document(): Document<Sample> {
    //   console.log("document updated");
    //   const documentId = this.documentId;
    //   return new Document<Sample>(collection.doc(documentId));
    // }
  },
  watch: {
    documentId: {
      handler(documentId) {
        this.document = new Document<Sample>(collection.doc(documentId));
      },
      immediate: true
    },
    document(_document, oldDocument) {
      console.log("close");
      oldDocument?.close();
    }
  },
  methods: {
    formatDate(timestamp: number) {
      return dayjs(timestamp).format("YYYY-MM-DD HH:mm:ss");
    }
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
