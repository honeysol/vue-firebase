import Vue from "vue";
import { firestore } from "firebase/app";
import { generateDocumentId } from "@/common/generateDocumentId";
import { Document, DocumentOptions } from "./document";
import { List } from "./list";
import { deriveQuery, deriveQueryParams } from "./queryUtil";

// use Symbol to avoid Vue observation
const refField = Symbol("ref");

export class Collection<T> {
  [refField]: firestore.CollectionReference<T>;
  constructor(ref: firestore.CollectionReference<T>) {
    this[refField] = ref;
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
  list() {
    return new List(this.ref);
  }
  add() {
    this[refField].doc(generateDocumentId()).set(({
      updateTime: Date.now()
    } as unknown) as T);
  }
  query(params: deriveQueryParams) {
    return new List(deriveQuery({ ...params, query: this.ref }));
  }
}
