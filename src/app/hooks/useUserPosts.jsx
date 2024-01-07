import React, { useContext, useEffect, useState } from "react";
import {
  collection,
  getDocs,
  onSnapshot,
  query,
  where,
  orderBy,
} from "firebase/firestore";
import { postsCol } from "../firebase/FireBase-config";
import { UserContext } from "../contexts/user";

export default function useUserPosts() {
  const [posts, setPosts] = useState([]);
  const user = useContext(UserContext);

  const getPosts = (user) => {
    // const querySnapshot = await getDocs(postsCol);
    if (user) {
      const q = query(
        postsCol,
        where("author.id", "==", `${user.uid}`),
        orderBy("timestamp.created.time", "desc")
      );

      onSnapshot(q, (querySnapshot) => {
        let postList = [];
        querySnapshot.forEach((doc) => {
          postList.push({ ...doc.data(), id: doc.id });

          // console.log(doc.id, " => ", doc.data());
        });
        setPosts(postList);
      });
    }
  };

  useEffect(() => {
    getPosts(user);
  }, [user]);

  return posts;
}
