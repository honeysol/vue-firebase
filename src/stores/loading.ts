import Vue from "vue";

export class Loading {
  counter = 0;
  constructor() {
    Vue.observable(this);
  }
  get isLoading() {
    return this.counter > 0;
  }
  async run(callback: () => Promise<void>) {
    ++this.counter;
    await callback();
    --this.counter;
  }
}
