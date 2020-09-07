import Vue from "vue";
import { firestore } from "firebase/app";
import documentId from "@/common/documentId";

const refField = Symbol("ref");
const unregisterField = Symbol("unregister");

interface DocData<T> {
  id: string;
  document: T;
}
export class List<T> {
  items: null | DocData<T>[] = null;
  [refField]: firestore.CollectionReference;
  [unregisterField]: () => void;
  constructor(ref: firestore.CollectionReference) {
    this[refField] = ref;
    this[unregisterField] = ref.onSnapshot(
      (snapshot: firestore.QuerySnapshot) => {
        this.items = (snapshot.docs || []).map(doc => ({
          document: doc.data() as T,
          id: doc.id
        }));
        console.log("snapshot", this.items);
      }
    );
    Vue.observable(this);
  }
  get ref() {
    return this[refField];
  }
  close() {
    this[unregisterField]();
  }
  add() {
    this[refField].doc(documentId()).set({
      updateTime: Date.now()
    });
  }
}
