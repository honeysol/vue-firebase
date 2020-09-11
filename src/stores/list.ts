import Vue from "vue";
import { firestore } from "firebase/app";
import { deriveQuery, deriveQueryParams } from "./queryUtil";

// use Symbol to avoid Vue observation
const refField = Symbol("ref");
const unregisterField = Symbol("unregister");

export interface ListOptions {
  listen?: boolean;
}

interface DocData<T> {
  id: string;
  document: T;
}
export class List<T> {
  items: null | DocData<T>[] = null;
  options: ListOptions | null = null;
  [refField]: firestore.Query<T>;
  [unregisterField]: () => void;
  constructor(ref: firestore.Query<T>, options?: ListOptions) {
    this.options = options || null;
    this[refField] = ref;
    if (this.options?.listen !== false) {
      this[unregisterField] = ref.onSnapshot(
        (snapshot: firestore.QuerySnapshot) => {
          this.items = (snapshot.docs || []).map(doc => ({
            document: doc.data() as T,
            id: doc.id
          }));
          console.log("snapshot", this.items);
        }
      );
    }
    Vue.observable(this);
  }
  get ref() {
    return this[refField];
  }
  query(params: deriveQueryParams) {
    return new List(deriveQuery({ ...params, query: this.ref }));
  }
  close() {
    this[unregisterField]();
  }
}
