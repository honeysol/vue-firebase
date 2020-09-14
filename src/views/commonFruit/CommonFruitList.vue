<template>
  <div>
    <div class="mainHeader">CommonFruit</div>
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
          <tbody>
            <CommonFruitListItem
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
          @click="$router.push({ name: 'CommonFruitItem' })"
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
import { CommonFruit } from "@/models/commonFruit";
import CommonFruitListItem from "@/views/commonFruit/CommonFruitListItem.vue";
import { Collection } from "@/stores/collection";
import { autoclose } from "@/mixins/autoclose";

const db = firebaseProject.firestore();
const collection = new Collection(
  db.collection("commonFruit") as firestore.CollectionReference<CommonFruit>
);

export default Vue.extend({
  name: "Home",
  mixins: [autoclose],
  components: { CommonFruitListItem },
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
