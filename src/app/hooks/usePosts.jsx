import React, { useEffect, useState } from "react";
import { collection, getDocs, onSnapshot, query } from "firebase/firestore";
import { postsCol } from "../firebase/FireBase-config";

export default function usePosts() {
  const [posts, setPosts] = useState([]);

  const getPosts = () => {
    // const querySnapshot = await getDocs(postsCol);
    const q = query(postsCol);

    onSnapshot(q, (querySnapshot) => {
      let postList = [];
      querySnapshot.forEach((doc) => {
        postList.push({ ...doc.data(), id: doc.id });

        // console.log(doc.id, " => ", doc.data());
      });
      setPosts(postList);
    });
  };

  useEffect(() => {
    getPosts();
  }, []);

  return posts;
}
