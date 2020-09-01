<template>
  <tr>
    <td>{{ document.id }}</td>
    <td>
      {{ dayjs(effectiveDocument.updateTime).format("YYYY-MM-DD HH:mm:ss") }}
    </td>
    <td>
      <input
        :class="editingDocument && editingDocument.title && 'isEditing'"
        :value="effectiveDocument.title"
        @input="update('title', $event.target.value)"
      />
    </td>
    <td>
      <input
        :class="editingDocument && editingDocument.text && 'isEditing'"
        :value="effectiveDocument.text"
        @input="update('text', $event.target.value)"
      />
    </td>

    <td>
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

console.log(firestore.Timestamp);
export default Vue.extend({
  name: "SampleListItem",
  components: {},
  props: {
    document: Object as Vue.PropType<Sample>,
    collection: Object as Vue.PropType<firestore.CollectionReference>
  },
  data() {
    return {
      editingDocument: null as null | Sample,
      dayjs
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
    },
    save() {
      this.collection
        .doc(this.document?.id)
        .update({ ...this.editingDocument, updateTime: Date.now() });
      this.editingDocument = null;
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
  }
});
</script>
<style lang="scss" scoped>
.isEditing {
  background: #fee;
}
table {
  td,
  th {
    padding: 0.2rem;
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
