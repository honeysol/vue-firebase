<template>
  <div>
    <div class="mainHeader">Shared Fruits</div>
    <div class="mainContent" v-if="list.items">
      <div class="tableWrapper">
        <table class="table c-table">
          <thead class="thead-light c-table-head">
            <tr>
              <th>
                ID
              </th>
              <th>
                Update Time
              </th>
              <th>
                Name
              </th>
              <th>
                Description
              </th>
              <th>
                Color
              </th>
              <th></th>
            </tr>
          </thead>
          <tbody class="c-table-body">
            <SharedFruitListItem
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
          @click="$router.push({ name: 'SharedFruitItem' })"
        >
          New
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { firestore } from "firebase/app";
import firebaseProject from "@/common/firebaseProject";
import { autoclose } from "@/mixins";
import { Collection } from "@/stores";
import { SharedFruit } from "@/models/sharedFruit";
import SharedFruitListItem from "./SharedFruitListItem.vue";

const db = firebaseProject.firestore();
const collection = new Collection(
  db.collection("sharedFruit") as firestore.CollectionReference<SharedFruit>
);

export default Vue.extend({
  name: "Home",
  mixins: [autoclose],
  components: { SharedFruitListItem },
  data() {
    return {
      list: collection.query({
        // You can use firestore operator ["<=", "array-contains", "in"]
        // and corresponding mongo-like operator [$gte, $in, $elementMatch]
        //
        // filter: { title: "aaa" },
        // filter: { description: "fff" },
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
