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

interface ModalParam<P, V> {
  component: typeof Vue;
  props: P;
  onClose: (result: V) => void;
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ModalParamAny = ModalParam<any, any>;

export default Vue.extend({
  name: "Modal",
  created() {
    modalService.registerComponent(this);
  },
  data() {
    return {
      modals: [] as ModalParamAny[]
    };
  },
  methods: {
    add<P, V>({
      props,
      callback,
      component
    }: {
      props: P;
      callback: (result: V | null) => void;
      component: typeof Vue;
    }): void {
      const modalParam = {
        component,
        props,
        onClose: (result: V | null) => {
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
