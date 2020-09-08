<template>
  <tr>
    <td>{{ documentId }}</td>
    <td>
      {{ formatDate(document.effective.updateTime) }}
    </td>
    <td>
      <input
        :class="document.editing && document.editing.title && 'isEditing'"
        :value="document.effective.title"
        @input="document.update('title', $event.target.value)"
      />
    </td>
    <td>
      <input
        :class="document.editing && document.editing.text && 'isEditing'"
        :value="document.effective.text"
        @input="document.update('text', $event.target.value)"
      />
    </td>

    <td>
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
        @click="
          $router.push({ name: 'SampleItem', params: { id: document.id } })
        "
      >
        Open
      </button>
    </td>
  </tr>
</template>

<script lang="ts">
import Vue from "vue";
import { firestore } from "firebase/app";
import dayjs from "dayjs";
import { Sample } from "@/models/sample";
import { Document } from "@/stores/document";
import { autoclose } from "@/mixins/autoclose";

export default Vue.extend({
  name: "SampleListItem",
  mixins: [autoclose],
  props: {
    documentId: String as Vue.PropType<string>,
    collection: Object as Vue.PropType<firestore.CollectionReference>
  },
  computed: {
    document(): Document<Sample> {
      console.log("document updated", this.documentId);
      return new Document<Sample>(this.collection.doc(this.documentId));
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
table {
  td,
  th {
    padding: 0.4rem 0.2rem;
  }
  .center {
    text-align: center;
  }
}
.btn {
  margin: 0 4px;
  line-height: 1em;
}
</style>
