declare module "vue/types/options" {
  interface ComponentOptions<V extends Vue> {
    autoclose?: string[];
  }
}

const filedPrefix = "__autoclose_";

export const autoclose = {
  created(this: Vue) {
    const { autoclose } = this.$options;
    const thisAny = this as any;
    for (const field of autoclose || []) {
      this.$watch(
        field,
        (newValue, _oldValue) => {
          console.log("closing by watch", field);
          const autoCloseField = filedPrefix + field;
          thisAny[autoCloseField]?.close();
          thisAny[autoCloseField] = newValue;
        },
        { immediate: true }
      );
    }
  },
  beforeDestroy(this: Vue) {
    const { autoclose } = this.$options;
    const thisAny = this as any;
    for (const field of autoclose || []) {
      const autoCloseField = filedPrefix + field;
      console.log("closing by beforeDestroy");
      thisAny[autoCloseField]?.close();
    }
  }
};
