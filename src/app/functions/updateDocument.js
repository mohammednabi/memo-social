import { doc, updateDoc, deleteDoc } from "firebase/firestore";
import { deleteObject, getStorage, ref } from "firebase/storage";
import { db } from "../firebase/FireBase-config";
import { v4 as uuidv4 } from "uuid";

export const toggleLove = (postId, likes, user) => {
  if (!likes.includes(`${user.uid}`)) {
    addLove(postId, likes, user);
  } else {
    removeLove(postId, likes, user);
  }
};

const addLove = (postId, likes, user) => {
  const commentRef = doc(db, "posts", postId);

  // console.log("likes should be added : ");
  updateDoc(commentRef, {
    likes: [...likes, `${user.uid}`],
  })
    .then(() => {
      return;
    })
    .catch((err) => {
      console.log("error adding love : ", err);
    });
};

const removeLove = (postId, likes, user) => {
  const commentRef = doc(db, "posts", postId);
  let modifiedLikes = likes.filter((like) => {
    if (like !== `${user.uid}`) {
      return like;
    }
  });

  updateDoc(commentRef, {
    likes: [...modifiedLikes],
  })
    .then(() => {
      return;
    })
    .catch((err) => {
      console.log("error adding love : ", err);
    });
};

export const addingComment = (postId, comments, comment, user) => {
  const commentRef = doc(db, "posts", postId);

  const commentData = {
    id: uuidv4(),
    content: comment,
    author: {
      id: `${user.uid}`,
      name: user.displayName,
      avatar: user.photoURL,
    },
  };

  return updateDoc(commentRef, {
    comments: [...comments, commentData],
  });
};

export const deletePost = (postId, postMedia) => {
  const commentRef = doc(db, "posts", postId);

  deleteDoc(commentRef);

  return deletePostMedia(postMedia);
};

const deletePostMedia = (postMedia) => {
  const storage = getStorage();
  const mediaRef = ref(storage, `${postMedia}`);

  return deleteObject(mediaRef);
};

export const updatePost = (postDescription, postId) => {
  const postRef = doc(db, "posts", `${postId}`);

  return updateDoc(postRef, {
    description: postDescription,
  });
};
