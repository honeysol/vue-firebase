import firebaseProject from "@/common/firebaseProject";
import { getErrorMessage, FirebaseError } from "@/common/firebaseErrorMessage";
import firebase from "firebase/app";
import Vue from "vue";

const getErrorResponse = (error: FirebaseError): AuthenticationResponse => {
  return { status: "error", error, errorMessage: getErrorMessage(error) };
};

type AuthenticationResponseStatus = "error" | "successed" | "requireMailAuth";
type AuthenticationStatus = "initializing" | "member" | "guest";
type ResolvedAuthenticationStatus = "member" | "guest";

type AuthenticationResponse =
  | AuthenticationResponseError
  | AuthenticationResponseSuccessed
  | AuthenticationResponseRequireMailAuth;
interface AuthenticationResponseError {
  status: "error";
  error?: Error;
  errorMessage?: string;
}
interface AuthenticationResponseSuccessed {
  status: "successed";
}
interface AuthenticationResponseRequireMailAuth {
  status: "requireMailAuth";
}

export class Authentication {
  isLoading = true;
  user: null | firebase.User = null;
  userCredential: null | firebase.auth.UserCredential = null;
  ready = this.init();

  get status(): AuthenticationStatus {
    if (this.isLoading) {
      return "initializing";
    } else {
      return this.user ? "member" : "guest";
    }
  }

  get userId() {
    return this.user?.uid;
  }

  async getStatus(): Promise<ResolvedAuthenticationStatus> {
    await this.ready;
    if (this.status === "initializing") {
      throw new Error("Inner error");
    }
    return this.status;
  }
  async init(): Promise<void> {
    return await new Promise<void>(resolve => {
      const handler = (user: firebase.User | null) => {
        this.user = user;
        this.isLoading = false;
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
  }): Promise<AuthenticationResponse> {
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
  async signUp({ email }: { email: string }): Promise<AuthenticationResponse> {
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
  }): Promise<AuthenticationResponse> {
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

  async mailAuth({ url }: { url: string }): Promise<AuthenticationResponse> {
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
  }): Promise<AuthenticationResponse> {
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
  async signOut(): Promise<AuthenticationResponse> {
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

export const authentication = Vue.observable(new Authentication());
