import Vue from "vue";
import { firestore } from "firebase/app";
import { confirm, alert } from "@/services/dialog";

// use Symbol to avoid Vue observation
const refField = Symbol("ref");
const producerField = Symbol("producer");
const unregisterField = Symbol("unregister");
const effectiveField = Symbol("effective");

export type documentReferenceProducer<T> = () => firestore.DocumentReference<T>;

export interface DocumentOptions<T> {
  afterSave?: ({ newId }: { newId: null | string }) => void;
  afterRemove?: ({ oldId }: { oldId: string }) => void;
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
  editing: null | Partial<T> = null;
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
      get: (_target, key: string | number | symbol) => {
        const _key = key as keyof T;
        return this.editing && Object.hasOwnProperty.call(this.editing, _key)
          ? this.editing[_key]
          : this.data?.[_key];
      },
      set: (_target, key, value): boolean => {
        const _key = key as keyof T & (number | string);
        if (!this.editing) {
          this.editing = Object.create(null) as Partial<T>;
        }
        Vue.set(this.editing, _key, value);
        return true;
      },
      has: (_target, _key: string | number | symbol): boolean => {
        return true;
      }
    }) as Partial<T>;
    // console.log(this[effectiveField]);
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
  async remove() {
    if (!this.canRemove) {
      return;
    }
    const response = await confirm({
      title: "Confirm",
      text: "Are you sure to delete?"
    });
    if (response) {
      if (this.ref) {
        const oldId = this.ref.id;
        await this.ref.delete();
        this.options?.afterRemove?.({ oldId });
      }
    }
  }
  async save() {
    if (!this.editing) {
      return;
    }
    const response = await confirm({
      title: "Confirm",
      text: "Are you sure to save?"
    });
    if (response) {
      const producer = this[producerField];
      const isCreate = this.ref === null;
      if (this.ref === null) {
        // create new item
        if (!producer) {
          throw new Error("Internal Error");
        }
        this.ref = producer();
        await this.ref.set(
          {
            ...this.data,
            ...this.editing,
            updateTime: Date.now()
          },
          { merge: true }
        );
      } else {
        // update existent item
        try {
          await this.ref.update({
            ...this.editing,
            updateTime: Date.now()
          });
        } catch (e) {
          if (e.code === "not-found") {
            await alert({
              title: "Alert",
              text: "Document is already removed"
            });
          }
          this.options?.onError?.({ error: e, code: e.code });
        }
      }
      this.editing = null;
      this.options?.afterSave?.({ newId: isCreate ? this.ref.id : null });
    }
  }
  async discard() {
    if (!this.canDiscard) {
      return;
    }
    const response = await confirm({
      title: "Confirm",
      text: "Are you sure to discard?"
    });
    if (response) {
      this.editing = null;
    }
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
