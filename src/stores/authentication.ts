import firebaseProject from "@/common/firebaseProject";
import { getErrorMessage } from "@/common/firebaseErrorMessage";
import firebase from "firebase/app";
import Vue from "vue";

const getErrorResponse = (error: any): AuthenticationReponse => {
  return { status: "error", error, errorMessage: getErrorMessage(error) };
};

interface AuthenticationReponse {
  status: "error" | "successed" | "requireMailAuth";
  error?: any;
  errorMessage?: string;
}

class Authentication {
  isInitializing = true;
  user: null | firebase.User = null;
  userCredential: null | firebase.auth.UserCredential = null;
  ready = this.init();

  get status() {
    if (this.isInitializing) {
      return "initializing";
    } else {
      return this.user ? "member" : "guest";
    }
  }

  async getStatus(): Promise<string> {
    await this.ready;
    return this.status;
  }
  async init(): Promise<void> {
    return await new Promise<void>(resolve => {
      const handler = (user: firebase.User | null) => {
        this.user = user;
        this.isInitializing = false;
        // eslint-disable-next-line @typescript-eslint/no-use-before-define
        unsubscribe();
        resolve();
      };
      const unsubscribe = firebaseProject.auth().onAuthStateChanged(handler);
    });
  }

  async signIn({
    email,
    password
  }: {
    email: string;
    password: string;
  }): Promise<AuthenticationReponse> {
    try {
      const userCredential = await firebaseProject
        .auth()
        .signInWithEmailAndPassword(email, password);
      console.log(userCredential);
      if (userCredential.user?.emailVerified) {
        this.user = userCredential.user;
        this.userCredential = userCredential;
        return { status: "successed" };
      } else {
        this.user = null;
        this.userCredential = null;
        return {
          status: "error",
          errorMessage: "System Error: Mail authentication not completed"
        };
      }
    } catch (e) {
      console.error(e);
      this.user = null;
      this.userCredential = null;
      return getErrorResponse(e);
    }
  }
  async signUp({ email }: { email: string }): Promise<AuthenticationReponse> {
    try {
      const actionCodeSettings = {
        url:
          location.protocol +
          "//" +
          location.host +
          "/mailAuth" +
          "?" +
          new URLSearchParams({ email }).toString(),
        handleCodeInApp: true
      };
      await firebaseProject
        .auth()
        .sendSignInLinkToEmail(email, actionCodeSettings);
      return { status: "successed" };
    } catch (e) {
      return getErrorResponse(e);
    }
  }
  async sendPasswordReset({
    email
  }: {
    email: string;
  }): Promise<AuthenticationReponse> {
    try {
      const actionCodeSettings = {
        url:
          location.protocol +
          "//" +
          location.host +
          "/mailAuth" +
          "?" +
          new URLSearchParams({ email }).toString(),
        handleCodeInApp: true
      };
      await firebaseProject
        .auth()
        .sendPasswordResetEmail(email, actionCodeSettings);
      return { status: "successed" };
    } catch (e) {
      return getErrorResponse(e);
    }
  }

  async mailAuth({ url }: { url: string }): Promise<AuthenticationReponse> {
    try {
      const urlParams = new URLSearchParams(new URL(url).search);
      const email = urlParams.get("email");
      if (email) {
        const userCredential = await firebaseProject
          .auth()
          .signInWithEmailLink(email, url);

        this.user = userCredential.user;
        this.userCredential = userCredential;
        return {
          status: "successed"
        };
      } else {
        return {
          status: "error"
        };
      }
    } catch (e) {
      return getErrorResponse(e);
    }
  }
  async updatePassword({
    password
  }: {
    password: string;
  }): Promise<AuthenticationReponse> {
    try {
      if (this.user) {
        await this.user.updatePassword(password);
        return {
          status: "successed"
        };
      }
    } catch (e) {
      return getErrorResponse(e);
    }
    return { status: "error" };
  }
  async signOut(): Promise<AuthenticationReponse> {
    await this.ready;
    try {
      await firebaseProject.auth().signOut();
      this.user = null;
      this.userCredential = null;
      return {
        status: "successed"
      };
    } catch (e) {
      return { status: "error", error: e };
    }
  }
}

export default Vue.observable(new Authentication());
