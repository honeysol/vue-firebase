import Vue from "vue";
import { firestore } from "firebase/app";
import documentId from "@/common/documentId";

// use Symbol to avoid Vue observation
const refField = Symbol("ref");
const unregisterField = Symbol("unregister");

interface DocData<T> {
  id: string;
  document: T;
}

const toDocData = <T>(doc: firestore.QueryDocumentSnapshot): DocData<T> => ({
  document: doc.data() as T,
  id: doc.id
});

export class List<T> {
  items: null | DocData<T>[] = [];
  [refField]: firestore.CollectionReference;
  [unregisterField]: () => void;
  constructor(ref: firestore.CollectionReference) {
    this[refField] = ref;
    this[unregisterField] = ref.onSnapshot(
      (snapshot: firestore.QuerySnapshot) => {
        for (const docChange of snapshot.docChanges()) {
          if (docChange.type === "added") {
            if (docChange.oldIndex === -1) {
              this.items?.push(toDocData<T>(docChange.doc));
            } else {
              this.items?.splice(
                docChange.oldIndex,
                0,
                toDocData<T>(docChange.doc)
              );
            }
          } else if (docChange.type === "modified") {
            this.items?.splice(
              docChange.oldIndex,
              1,
              toDocData<T>(docChange.doc)
            );
          } else if (docChange.type === "removed") {
            this.items?.splice(docChange.oldIndex, 1);
          }
        }
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
