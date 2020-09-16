<template>
  <tr>
    <td>{{ documentId }}</td>
    <td>
      {{ formatDate(document.effective.updateTime) }}
    </td>
    <td>
      <input
        :class="document.edited('name') && 'isEditing'"
        v-model="document.effective.name"
      />
    </td>
    <td>
      <input
        :class="document.edited('description') && 'isEditing'"
        v-model="document.effective.description"
      />
    </td>
    <td>
      <input
        :class="document.edited('color') && 'isEditing'"
        v-model="document.effective.color"
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
          $router.push({ name: 'UserFruitItem', params: { id: document.id } })
        "
      >
        Open
      </button>
    </td>
  </tr>
</template>

<script lang="ts">
import Vue from "vue";
import dayjs from "dayjs";
import { autoclose } from "@/mixins";
import { Document, Collection } from "@/stores";
import { UserFruit } from "@/models/userFruit";

export default Vue.extend({
  name: "UserFruitListItem",
  mixins: [autoclose],
  props: {
    documentId: String as Vue.PropType<string>,
    collection: Object as Vue.PropType<Collection<UserFruit>>
  },
  computed: {
    document(): Document<UserFruit> {
      return this.collection.doc(this.documentId);
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
