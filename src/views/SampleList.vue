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
          v-for="document in documents"
          :key="document.id + '#'"
          :document="document"
          :collection="collection"
        />
      </tbody>
    </table>

    <div style="margin: 10px">
      <button type="button" class="btn btn-secondary" @click="add()">
        Add
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import firebase from "firebase/app";
import firebaseProject from "@/common/firebaseProject";
import documentId from "@/common/documentId";
import SampleListItem from "@/views/SampleListItem.vue";

const db = firebaseProject.firestore();
const collection = db.collection("publicDocuments");

console.log(firebase.firestore.Timestamp);
export default Vue.extend({
  name: "Home",
  components: { SampleListItem },
  data() {
    return {
      documents: [],
      collection
    };
  },
  methods: {
    add: function() {
      collection.doc(documentId()).set({
        updateTime: Date.now()
        // timestemp: firebase.firestore.FieldValue.serverTimestamp()
      });
    }
  },
  firestore: {
    documents: collection
  }
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
