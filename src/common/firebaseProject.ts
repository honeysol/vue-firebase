import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";
import "firebase/storage";
import firebaseConfig from "@/config/firebaseConfig.json";

export default firebase.initializeApp(firebaseConfig);
