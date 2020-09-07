import Vue from "vue";
import { firestore } from "firebase/app";
import { confirm } from "@/services/dialog";

const refField = Symbol("ref");
const unregisterField = Symbol("unregister");

export class Document<T> {
  data: null | T = null;
  [refField]: firestore.DocumentReference;
  editing: null | Partial<T> = null;
  [unregisterField]: () => void;
  id: string;
  constructor(ref: firestore.DocumentReference) {
    this.id = ref.id;
    this[unregisterField] = ref.onSnapshot(
      (snapshot: firestore.DocumentSnapshot) => {
        this.data = (snapshot.data() || null) as T;
        console.log("snapshot", this.data);
      }
    );
    this[refField] = ref;
    Vue.observable(this);
  }
  close() {
    this[unregisterField]();
  }
  async remove() {
    const response = await confirm({
      title: "Confirm",
      text: "Are you sure to delete?"
    });
    if (response) {
      this[refField]?.delete();
    }
  }
  async save() {
    const response = await confirm({
      title: "Confirm",
      text: "Are you sure to save?"
    });
    if (response) {
      await this[refField]?.update({
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
