import { makeAutoObservable } from "mobx";

import {
  collection,
  getDocs,
  onSnapshot,
  query,
  orderBy,
  where,
  setDoc,
  doc,
  getDoc,
} from "firebase/firestore";

// import { db, postsCol } from "@/app/firebase/FireBase-config";
import { db, postsCol } from "../app/firebase/FireBase-config";

import { defaultUser, post } from "./generalCustomTypes";

export class currentUser {
  signedUser: defaultUser = {
    uid: "",
    displayName: "",
    email: "",
    photoURL: "",
    data: {
      bio: "",
      followers: [],
      following: [],
      link: "",
      username: "",
    },
  };
  userPosts: post[] = [];
  userPostsLength: number = 0;

  constructor() {
    makeAutoObservable(this);
  }

  saveCurrentUser(current: defaultUser) {
    getDoc(doc(db, "users", `${current.uid}`)).then((result) => {
      const newUser = { ...current, data: { ...result.data().data } };

      this.signedUser = newUser;
    });
  }

  getUserPosts(uid: any) {
    const q = query(
      postsCol,
      where("author.id", "==", `${uid}`),
      orderBy("timestamp.created.time", "desc")
    );

    onSnapshot(q, (querySnapshot) => {
      let postList: post[] = [];
      querySnapshot.forEach((doc) => {
        postList.push({
          id: doc.id,
          author: {
            avatar: "",
            email: "",
            id: "",
            name: "",
          },
          comments: [],
          description: "",
          likes: [],
          media: "",
          mediaType: "",
          timestamp: {
            created: {
              date: "",
              time: 0,
            },
            updated: {
              date: "",
              time: 0,
            },
          },
          ...doc.data(),
        });
      });
      this.userPosts = postList;
      this.userPostsLength = postList.length;
    });
  }

  addUserToUserCollection(
    userId: string,
    data: {
      data:
        | {
            bio: string;
            followers: string[];
            following: string[];
            link: string;
            username: string;
          }
        | {
            bio: string;
            followers: string[];
            following: string[];
            link: string;
            username: string;
          };
    }
  ) {
    const docRef = doc(db, "users", userId);

    return setDoc(docRef, {
      ...data,
    });
  }
}
