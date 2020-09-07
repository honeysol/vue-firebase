<template>
  <div class="componentRoot">
    <table class="table">
      <thead class="thead-light">
        <tr>
          <th>
            ID
          </th>
          <th>
            Update Time
          </th>
          <th>
            Title
          </th>
          <th>
            Text
          </th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <SampleListItem
          v-for="item in list.items"
          :key="item.id + '#'"
          :documentId="item.id"
          :collection="list.ref"
        />
      </tbody>
    </table>

    <div style="margin: 10px">
      <button type="button" class="btn btn-secondary" @click="list.add()">
        Add
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import firebase from "firebase/app";
import firebaseProject from "@/common/firebaseProject";
import SampleListItem from "@/views/SampleListItem.vue";
import { List } from "@/stores/list";

const db = firebaseProject.firestore();
const collection = db.collection("publicDocuments");

const list = new List(collection);

console.log(firebase.firestore.Timestamp);
export default Vue.extend({
  name: "Home",
  components: { SampleListItem },
  data() {
    return {
      list
    };
  },
  methods: {}
});
</script>
<style lang="scss" scoped>
table {
  td,
  th {
    padding: 0.4rem 0.2rem;
  }
}
.componentRoot {
  margin: 10px;
  overflow-x: auto;
  white-space: nowrap;
}
</style>
