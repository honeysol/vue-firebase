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
import { List } from "@/stores/list";
import { autoclose } from "@/mixins/autoclose";

export default Vue.extend({
  name: "SampleListItem",
  mixins: [autoclose],
  props: {
    documentId: String as Vue.PropType<string>,
    list: Object as Vue.PropType<List<Sample>>
  },
  computed: {
    document(): Document<Sample> {
      return this.list.doc(this.documentId);
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
table {
  td,
  th {
    padding: 0.4rem 0.2rem;
  }
}
</style>
