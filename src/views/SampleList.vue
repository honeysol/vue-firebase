<template>
  <div>
    <div class="mainHeader">Sample</div>
    <div class="mainContent" v-if="list.items">
      <div class="tableWrapper">
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
              :collection="collection"
            />
          </tbody>
        </table>
      </div>

      <div style="margin: 10px">
        <button
          type="button"
          class="btn btn-secondary"
          @click="collection.add()"
        >
          Add(inline)
        </button>
        <button
          type="button"
          class="btn btn-secondary"
          @click="$router.push({ name: 'SampleItem' })"
        >
          New
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import firebaseProject from "@/common/firebaseProject";
import SampleListItem from "@/views/SampleListItem.vue";
import { Collection } from "@/stores/collection";
import { autoclose } from "@/mixins/autoclose";

const db = firebaseProject.firestore();
const collection = new Collection(db.collection("publicDocuments"));

export default Vue.extend({
  name: "Home",
  mixins: [autoclose],
  components: { SampleListItem },
  data() {
    return {
      list: collection.query({
        // You can use firestore operator ["<=", "array-contains", "in"]
        // and corresponding mongo-like operator [$gte, $in, $elementMatch]
        //
        // filter: { title: "aaa" },
        // filter: { text: "fff" },
        // documentId: { $gt: "1747b2878c1d5e466a950839265" },
        // limit: 1,
        // limitToLast: 3
      }),
      collection
    };
  },
  autoclose: ["list"]
});
</script>
<style lang="scss" scoped>
.tableWrapper {
  overflow-x: auto;
  white-space: nowrap;
}
</style>
