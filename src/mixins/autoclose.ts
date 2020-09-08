declare module "vue/types/options" {
  interface ComponentOptions<V extends Vue> {
    autoclose?: string[];
  }
}

export const autoclose = {
  created(this: Vue) {
    const { autoclose } = this.$options;
    for (const field of autoclose || []) {
      this.$watch(field, (newValue, oldValue) => {
        console.log("closing", field);
        oldValue?.close?.();
      });
    }
  },
  beforeDestroy(this: Vue) {
    const { autoclose } = this.$options;
    for (const field of autoclose || []) {
      console.log("closing", field);
      this[field as keyof Vue]?.close?.();
    }
  }
};
