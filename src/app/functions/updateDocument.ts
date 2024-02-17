import { doc, updateDoc, deleteDoc, setDoc } from "firebase/firestore";
import { deleteObject, getStorage, ref, uploadBytes } from "firebase/storage";
import { db } from "../firebase/FireBase-config";
import { v4 as uuidv4 } from "uuid";
import { getAuth, updateProfile } from "firebase/auth";

export const toggleLove = (
  postId: string,
  likes: string[],
  user: { uid: string }
) => {
  if (!likes.includes(`${user.uid}`)) {
    addLove(postId, likes, user);
  } else {
    removeLove(postId, likes, user);
  }
};

const addLove = (postId: string, likes: any, user: { uid: any }) => {
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

const removeLove = (postId: string, likes: string[], user: { uid: string }) => {
  const commentRef = doc(db, "posts", postId);
  let modifiedLikes = likes.filter((like: string) => {
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

export const addingComment = (
  postId: string,
  comments: any,
  comment: any,
  user: { uid: any; displayName: any; photoURL: any }
) => {
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

export const deletePost = (postId: string, postMedia: any) => {
  const commentRef = doc(db, "posts", postId);

  deleteDoc(commentRef);

  return deletePostMedia(postMedia);
};

const deletePostMedia = (postMedia: any) => {
  const storage = getStorage();
  const mediaRef = ref(storage, `${postMedia}`);

  return deleteObject(mediaRef);
};

export const updatePost = (postDescription: any, postId: any) => {
  const postRef = doc(db, "posts", `${postId}`);

  return updateDoc(postRef, {
    description: postDescription,
  });
};

export const editUserProfile = (username: any, photoURL: any) => {
  const auth = getAuth();
  return updateProfile(auth.currentUser, {
    displayName: username,
    photoURL: photoURL,
  });
};

export const addUser = (
  userId: any,
  data: {
    displayName: any;
    uid: any;
    userName: any;
    bio: any;
    photoURL: any;
    link: any;
    followers: any;
    following: any;
  }
) => {
  const userRef = doc(db, "users", `${userId}`);
  const userData = { data };
  return setDoc(userRef, userData);
};

export const uploadAvatarImage = (
  imageObj: Blob | Uint8Array | ArrayBuffer
) => {
  if (imageObj === null) return;
  const storage = getStorage();
  const imageRef = ref(storage, `/avatars/${imageObj.name + uuidv4()}`);

  return uploadBytes(imageRef, imageObj);
  // .then((uploadedImg) => {

  //   if (uploadedImg.ref._location.path_ !== null) {
  //     getDownloadURL(imageRef).then((url) => {
  //       addPost(user, url, inputComment);
  //     });
  //   }
  //   console.log("this is the uploaded img : ", uploadedImg);
  // })
  // .catch((error) => {
  //   setIsUploading(false);
  //   alert("Failed to upload media", error);
  // });
};

export const updateUserImage = (userId: any, imgUrl: string, data: any) => {
  const userRef = doc(db, "users", `${userId}`);
  const auth = getAuth();
  updateProfile(auth.currentUser, {
    photoURL: imgUrl,
  });
  return updateDoc(userRef, {
    data: {
      ...data,
      photoURL: imgUrl,
    },
  });
};
