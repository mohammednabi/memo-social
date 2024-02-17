// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

import { getFirestore, collection, getDocs } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_KEY,
  authDomain: "memo-19919.firebaseapp.com",
  projectId: "memo-19919",
  storageBucket: "memo-19919.appspot.com",
  messagingSenderId: "6628085493",
  appId: "1:6628085493:web:7a9669b9a6f5f308b03fbc",
  measurementId: "G-0J5TGQ0J70",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);

export const postsCol = collection(db, "posts");

export async function getPosts(db) {
  const postsSnapshot = await getDocs(postsCol);
  let newPosts = [];
  postsSnapshot.docs.forEach((doc) =>
    newPosts.push({ ...doc.data(), id: doc.id })
  );
  //   const postsList = postsSnapshot.docs.map((doc) => doc.data());
  return newPosts;
}
