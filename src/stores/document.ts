import Vue from "vue";
import { firestore } from "firebase/app";
import { confirm, alert } from "@/services/dialog";
import { objectGetter, DocumentData, updateDataToObject } from "./objectUtil";

// use Symbol to avoid Vue observation
const refField = Symbol("ref");
const producerField = Symbol("producer");
const unregisterField = Symbol("unregister");
const effectiveField = Symbol("effective");

export type documentReferenceProducer<T> = () => firestore.DocumentReference<T>;

/*
  mode: Specify behaviour in save (this is only applied if params is DocumentEditParams )
    "replace": Replace if document exists, create if not
    "soft"(default): Update if document exists, create if not
    "strict": Update if document exists, fail if not
*/
export type documentMode = "replace" | "soft" | "strict" | null;

export interface DocumentOptions<T> {
  restriction?: Partial<T>;
  mode?: documentMode;
  onError?: ({
    error,
    errorMessage
  }: {
    error: Error;
    code: string;
    errorMessage?: string;
  }) => void;
}

export interface DocumentEditParams<T> {
  ref: firestore.DocumentReference<T>;
}
export interface DocumentCreateParams<T> {
  producer: documentReferenceProducer<T>;
  defaultValue?: Partial<T>;
}

export class Document<T> {
  data: null | Partial<T> = null;
  exists: boolean | null = null;
  editing: null | firestore.UpdateData = null;
  [effectiveField]: Partial<T>;
  options: DocumentOptions<T> | null = null;
  [refField]: firestore.DocumentReference<T> | null = null;
  [producerField]: documentReferenceProducer<T> | null = null;
  [unregisterField]: () => void;
  constructor(
    params: DocumentEditParams<T> | DocumentCreateParams<T>,
    options?: DocumentOptions<T>
  ) {
    this.options = options || null;
    if ((params as DocumentEditParams<T>).ref) {
      const { ref } = params as DocumentEditParams<T>;
      this.ref = ref;
    } else {
      const { producer, defaultValue } = params as DocumentCreateParams<T>;
      this[producerField] = producer;
      this.data = defaultValue || null;
    }
    this[effectiveField] = new Proxy(Object.create(null), {
      get: (_target, key: string) => {
        return this.editing && Object.hasOwnProperty.call(this.editing, key)
          ? this.editing[key]
          : objectGetter(this.data as DocumentData | null, key);
      },
      set: (_target, key: string, value): boolean => {
        if (!this.editing) {
          this.editing = Object.create(null) as firestore.UpdateData;
        }
        Vue.set(this.editing, key, value);
        return true;
      },
      has: (_target, _key: string | number | symbol): boolean => {
        // trick for Vue.set()
        return true;
      }
    }) as Partial<T>;
    Vue.observable(this);
  }
  set ref(ref: firestore.DocumentReference<T> | null) {
    if (this[unregisterField]) {
      this[unregisterField]();
    }
    if (ref) {
      this[unregisterField] = ref.onSnapshot(snapshot => {
        this.data = snapshot.data() || null;
        this.exists = snapshot.exists;
        console.log("snapshot", this.data);
      });
    } else {
      this.data = null;
      this.exists = null;
    }
    this[refField] = ref;
  }
  get ref() {
    return this[refField];
  }
  get effective() {
    return this[effectiveField];
  }
  get id() {
    return this.ref?.id;
  }
  get isNew() {
    return this.ref === null;
  }
  get canRemove() {
    return this.exists === true;
  }
  get canSave() {
    return this.editing !== null;
  }
  get canDiscard() {
    return this.editing !== null;
  }
  close() {
    this.ref = null;
  }
  async remove({ force = false }: { force?: boolean } = {}) {
    if (!this.canRemove) {
      return;
    }
    const response =
      force ||
      (await confirm({
        title: "Confirm",
        text: "Are you sure to delete?"
      }));
    if (response) {
      if (this.ref) {
        const oldId = this.ref.id;
        await this.ref.delete();
        return { oldId, successed: true };
      }
    }
  }
  async removeForce() {
    return this.remove({ force: true });
  }
  async set({ merge = true }: { merge?: boolean } = {}) {
    if (!this.ref) {
      const producer = this[producerField];
      if (!producer) {
        throw new Error("Internal Error");
      }
      this.ref = producer();
    }
    await this.ref.set(
      ({
        ...this.data,
        ...updateDataToObject(this.editing || {}),
        ...this.options?.restriction,
        updateTime: Date.now()
      } as unknown) as T,
      { merge }
    );
  }
  async save({ force = false }: { force?: boolean } = {}) {
    if (!this.editing) {
      return;
    }
    const response =
      force ||
      (await confirm({
        title: "Confirm",
        text: "Are you sure to save?"
      }));
    if (response) {
      const isCreate = this.ref === null;
      if (this.ref === null) {
        this.set();
        if (this.ref === null) {
          throw new Error("internal error");
        }
      } else if (this.options?.mode === "replace") {
        this.set({ merge: false });
      } else {
        try {
          await this.ref.update({
            ...this.editing,
            ...this.options?.restriction,
            updateTime: Date.now()
          });
        } catch (e) {
          if (e.code === "not-found") {
            if (this.options?.mode === "soft" || !this.options?.mode) {
              this.set();
            } else {
              await alert({
                title: "Alert",
                text: "Document is already removed"
              });
            }
          }
          this.options?.onError?.({ error: e, code: e.code });
        }
      }
      this.editing = null;
      return { newId: isCreate ? this.ref.id : null, successed: true };
    }
  }
  async saveForce() {
    return this.save({ force: true });
  }

  async discard({ force = false }: { force?: boolean } = {}) {
    if (!this.canDiscard) {
      return;
    }
    const response =
      force ||
      (await confirm({
        title: "Confirm",
        text: "Are you sure to discard?"
      }));
    if (response) {
      this.editing = null;
    }
  }
  async discardForce() {
    return this.discard({ force: true });
  }

  edited(fieldName?: keyof T) {
    if (fieldName) {
      return (
        this.editing && Object.hasOwnProperty.call(this.editing, fieldName)
      );
    } else {
      return this.editing !== null;
    }
  }
}
