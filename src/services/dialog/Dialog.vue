<template>
  <div id="modal">
    <div
      class="modal fade"
      :class="show && 'show'"
      style="display: block"
      tabindex="-1"
    >
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="exampleModalLabel">{{ title }}</h5>
            <button
              type="button"
              class="close"
              data-dismiss="modal"
              aria-label="Close"
              @click="close(null)"
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            {{ text }}
          </div>
          <div class="modal-footer">
            <a
              v-for="(button, index) in buttons"
              @click="
                close(button.value);
                !button.url && $event.preventDefault();
              "
              :key="index"
              :download="button.filename"
              :href="button.url"
              class="btn"
              :class="button.class"
              type="button"
              data-dismiss="modal"
            >
              {{ button.title }}
            </a>
          </div>
        </div>
      </div>
    </div>
    <div class="modal-backdrop fade" :class="show && 'show'"></div>
  </div>
</template>
<script lang="ts">
import Vue from "vue";
import { ButtonParams } from "./index";
import { wait } from "@/common/util";

type milisecond = number;

export default Vue.extend({
  name: "Dialog",
  async created() {
    await wait(16);
    this.show = true;
  },
  props: {
    title: String,
    text: String,
    buttons: Array as Vue.PropType<ButtonParams<unknown>[]>
  },
  data() {
    return {
      show: false
    };
  },
  methods: {
    async close(value: unknown) {
      this.show = false;
      await wait(150);
      this.$emit("close", value);
    }
  }
});
</script>

<style lang="scss"></style>
