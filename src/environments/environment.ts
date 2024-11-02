import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

export const environment = {
  apiKey: "AIzaSyBqmJ6c67ttUUey7A3-Zi_7TSO0L0SddRo",
  authDomain: "estoque-96033.firebaseapp.com",
  projectId: "estoque-96033",
  storageBucket: "estoque-96033.appspot.com",
  messagingSenderId: "154032135790",
  appId: "1:154032135790:web:d42f0d4e845d66e719907f",
  measurementId: "G-8XKFLRP5HC"
};

const app = initializeApp(environment);
const analytics = getAnalytics(app);