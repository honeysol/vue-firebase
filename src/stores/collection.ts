import Vue from "vue";
import { firestore } from "firebase/app";
import { generateDocumentId } from "@/common/generateDocumentId";
import { Document, DocumentOptions } from "./document";
import { List } from "./list";
import { deriveQuery, deriveQueryParams } from "./queryUtil";

// use Symbol to avoid Vue observation
const refField = Symbol("ref");
const optionsField = Symbol("option");

interface Options<T> {
  restriction: Partial<T>;
}

export class Collection<T> {
  [optionsField]?: Options<T>;
  [refField]: firestore.CollectionReference<T>;
  constructor(ref: firestore.CollectionReference<T>, options?: Options<T>) {
    console.log("options", options);
    this[refField] = ref;
    this[optionsField] = options;
    Vue.observable(this);
  }
  get ref() {
    return this[refField];
  }
  doc(
    documentId: string | null | undefined,
    options?: DocumentOptions<T> & { defaultValue?: Partial<T> }
  ): Document<T> {
    return new Document<T>(
      documentId
        ? { ref: this.ref.doc(documentId) }
        : {
            producer: () => this.ref.doc(generateDocumentId()),
            defaultValue: options?.defaultValue
          },
      { ...options, restriction: this[optionsField]?.restriction }
    );
  }
  list() {
    return new List(this.ref);
  }
  add() {
    this[refField].doc(generateDocumentId()).set(({
      ...this[optionsField]?.restriction,
      updateTime: Date.now()
    } as unknown) as T);
  }
  query(params: deriveQueryParams) {
    console.log(this[optionsField]?.restriction, {
      ...params,
      filter: { ...params.filter, ...this[optionsField]?.restriction },
      query: this.ref
    });
    return new List(
      deriveQuery({
        ...params,
        filter: { ...params.filter, ...this[optionsField]?.restriction },
        query: this.ref
      })
    );
  }
}
