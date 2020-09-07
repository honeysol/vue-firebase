import Vue from "vue";
import { firestore } from "firebase/app";
import { confirm } from "@/services/dialog";

export class Document<T> {
  data: null | T = null;
  ref: firestore.DocumentReference;
  editing: null | Partial<T> = null;
  unregister: () => void;
  id: string;
  constructor(ref: firestore.DocumentReference) {
    this.ref = ref;
    this.id = ref.id;
    this.unregister = ref.onSnapshot((snapshot: firestore.DocumentSnapshot) => {
      this.data = (snapshot.data() || null) as T;
      console.log("snapshot", this.data);
    });
    Vue.observable(this);
  }
  close() {
    this.unregister();
  }
  async remove() {
    const response = await confirm({
      title: "Confirm",
      text: "Are you sure to delete?"
    });
    if (response) {
      this.ref?.delete();
    }
  }
  async save() {
    const response = await confirm({
      title: "Confirm",
      text: "Are you sure to save?"
    });
    if (response) {
      await this.ref?.update({
        ...this.editing,
        updateTime: Date.now()
      });
      this.editing = null;
    }
  }
  async discard() {
    const response = await confirm({
      title: "Confirm",
      text: "Are you sure to discard?"
    });
    if (response) {
      this.editing = null;
    }
  }
  edited(fieldName: keyof T) {
    return this.editing?.[fieldName];
  }
  update<S extends keyof T & (string | number)>(fieldName: S, value: T[S]) {
    if (!this.editing) {
      this.editing = {};
    }
    Vue.set(this.editing, fieldName, value);
  }
}
