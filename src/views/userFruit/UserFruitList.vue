<template>
  <div>
    <div class="mainHeader">UserFruit</div>
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
            <UserFruitListItem
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
          @click="$router.push({ name: 'UserFruitItem' })"
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
import UserFruitListItem from "@/views/userFruit/UserFruitListItem.vue";
import { Collection } from "@/stores/collection";
import { autoclose } from "@/mixins/autoclose";
import authentication from "@/stores/authentication";

const db = firebaseProject.firestore();

export default Vue.extend({
  name: "UserFruitList",
  mixins: [autoclose],
  components: { UserFruitListItem },
  data() {
    return {
      authentication
    };
  },
  computed: {
    collection(this: any) {
      return new Collection(db.collection("userFruit"), {
        restriction: {
          userId: this.authentication.userId
        }
      });
    },
    list() {
      return this.collection.query({});
    }
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
