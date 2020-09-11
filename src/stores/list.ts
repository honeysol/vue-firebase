import Vue from "vue";
import { firestore } from "firebase/app";
import { generateDocumentId } from "@/common/generateDocumentId";
import { Document, DocumentOptions } from "./document";

// use Symbol to avoid Vue observation
const refField = Symbol("ref");
const unregisterField = Symbol("unregister");

interface ListOptions {
  listen?: boolean;
}

interface DocData<T> {
  id: string;
  document: T;
}
export class List<T> {
  items: null | DocData<T>[] = null;
  options: ListOptions | null = null;
  [refField]: firestore.CollectionReference<T>;
  [unregisterField]: () => void;
  constructor(ref: firestore.CollectionReference<T>, options?: ListOptions) {
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
  doc(
    documentId: string | null | undefined,
    options?: DocumentOptions<T> & { defaultValue?: T }
  ): Document<T> {
    return new Document<T>(
      documentId
        ? { ref: this.ref.doc(documentId) }
        : {
            producer: () => this.ref.doc(generateDocumentId()),
            defaultValue: options?.defaultValue
          },
      options
    );
  }
  close() {
    this[unregisterField]();
  }
  add() {
    this[refField].doc(generateDocumentId()).set(({
      updateTime: Date.now()
    } as unknown) as T);
  }
}
