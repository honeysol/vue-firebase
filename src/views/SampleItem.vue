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
    return {};
  },
  beforeDestroy() {
    this.document?.close();
    // no effect
    // this.document = null;
  },
  computed: {
    document(): Document<Sample> | null {
      console.log("document updated", this.$route.params.id);
      return this.$route.params.id
        ? new Document<Sample>(collection.doc(this.$route.params.id))
        : null;
    }
  },
  watch: {
    document(document, oldDocument) {
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
