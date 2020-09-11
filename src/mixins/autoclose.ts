const unregisterMapField = Symbol("autoclose");
declare module "vue/types/options" {
  interface ComponentOptions<V extends Vue> {
    autoclose?: string[];
  }
}
declare module "vue/types/vue" {
  interface Vue {
    [unregisterMapField]: Record<string, { close: () => void }>;
  }
}

export const autoclose = {
  created(this: Vue) {
    const { autoclose: autoCloseFields } = this.$options;
    this[unregisterMapField] = {};
    const unregisterMap = this[unregisterMapField];
    for (const field of autoCloseFields || []) {
      this.$watch(
        field,
        (newValue, _oldValue) => {
          if (unregisterMap[field]) {
            console.log("closing by watch", field);
          }
          unregisterMap[field]?.close();
          unregisterMap[field] = newValue;
        },
        { immediate: true }
      );
    }
  },
  beforeDestroy(this: Vue) {
    const { autoclose: autoCloseFields } = this.$options;
    const unregisterMap = this[unregisterMapField];
    for (const field of autoCloseFields || []) {
      console.log("closing by beforeDestroy");
      unregisterMap[field]?.close();
    }
  }
};
