import React, { useContext, useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";

import { db } from "../firebase/FireBase-config";
export default function useTargetPost(targetPostId) {
  const [targetPost, setTargetPost] = useState();

  const getTargetDoc = (db, targetPostId) => {
    const docRef = doc(db, "posts", targetPostId);

    getDoc(docRef)
      .then((docSnapshot) => {
        console.log(
          "this is the target post from the hook :",
          docSnapshot.data()
        );
        setTargetPost({ ...docSnapshot.data(), id: docSnapshot.id });
        console.log("this is the target post from the state :", targetPost);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    getTargetDoc(db, targetPostId);
  }, [targetPostId, targetPost]);

  return targetPost;
}
