<template>
  <div id="modal">
    <div v-for="(modal, index) in modals" :key="index">
      <component
        v-bind="modal.props"
        @close="modal.onClose($event)"
        :is="modal.component"
      ></component>
    </div>
  </div>
</template>
<script lang="ts">
import Vue from "vue";
import modalService from "./index";

interface ModalParam {
  component: typeof Vue;
  props: any;
  onClose: (result: any) => void;
}

type modalCallback = (result: any) => void;

export default Vue.extend({
  name: "Modal",
  created() {
    modalService.registerComponent(this);
  },
  data() {
    return {
      modals: [] as Array<ModalParam>
    };
  },
  methods: {
    add<T>({
      props,
      callback,
      component
    }: {
      props: any;
      callback: (result: T | null) => void;
      component: typeof Vue;
    }): void {
      const modalParam = {
        component,
        props,
        onClose: (result: T | null) => {
          this.modals = this.modals.filter(modal => modal !== modalParam);
          callback(result);
        }
      };
      this.modals.push(modalParam);
    }
  }
});
</script>

<style lang="scss"></style>
