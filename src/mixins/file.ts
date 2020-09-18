import Vue from "vue";
import firebaseProject from "@/common/firebaseProject";
import { authentication } from "@/stores";
import { storage as storageProvider } from "firebase/app";
const storage = firebaseProject.storage();
import { generateDocumentId } from "@/common/generateDocumentId";

export const file = Vue.extend({
  data() {
    return {
      url: null as string | null,
      uploadedFile: null as { url: string; value: string } | null,
      progress: null as null | number,
      errorCode: null as null | string
    };
  },
  props: {
    value: String
  },
  destroyed() {
    this.releaseUrl();
  },
  methods: {
    clear() {
      this.$emit("input", null);
    },
    async change(event: Event) {
      console.log(event);
      const file = (event.target as HTMLInputElement)?.files?.[0];
      if (!file || !authentication.userId) {
        return;
      }
      const path = `${authentication.userId}/${generateDocumentId()}`;
      const storageRef = storage.ref().child(path);

      this.releaseUrl();
      this.url = URL.createObjectURL(file);
      this.uploadedFile = {
        url: this.url,
        value: path
      };
      this.errorCode = null;
      this.progress = 0;
      try {
        const uploadTask = storageRef.put(file, {
          contentType: file.type
        });
        uploadTask.on(storageProvider.TaskEvent.STATE_CHANGED, snapshot => {
          this.progress = snapshot.bytesTransferred / snapshot.totalBytes;
        });
        await uploadTask;
        this.progress = null;
        this.$emit("input", path);
      } catch (e) {
        console.error(e);
        this.progress = null;
        this.errorCode = e.code;
        this.releaseUrl();
        this.url = null;
      }
    },
    async download() {
      const storageRef = storage.ref().child(this.value);
      const signedUrl = await storageRef.getDownloadURL();
      this.releaseUrl();
      this.url = signedUrl;
    },
    releaseUrl() {
      if (this.uploadedFile?.url) {
        URL.revokeObjectURL(this.uploadedFile?.url);
        this.uploadedFile = null;
      }
    }
  },
  watch: {
    value(value: string, _oldValue: string) {
      if (value) {
        if (value !== this.uploadedFile?.value) {
          this.download();
        }
      } else {
        this.releaseUrl();
        this.url = null;
      }
    }
  }
});
