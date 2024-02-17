"use client";

// import PostModal from "@/app/components/PostModal";
// import { StoreContext } from "@/app/contexts/StoreContext";
// import { UserContext } from "@/app/contexts/user";
// import { db, getPosts } from "@/app/firebase/FireBase-config";
// import usePosts from "@/app/hooks/usePosts";
// import useTargetPost from "@/app/hooks/useTargetPost";
// import useUserPosts from "@/app/hooks/useUserPosts";


import PostModal from "../../../components/PostModal";
import { StoreContext } from "../../../contexts/StoreContext";
// import { UserContext } from "../../../contexts/user";
import { db, getPosts } from "../../../firebase/FireBase-config";


import { Movie, MovieOutlined } from "@mui/icons-material";

import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import React, { useContext, useEffect, useState } from "react";

import { observer } from "mobx-react-lite";
import { post } from "../../../../stores/generalCustomTypes";

const ProfilePostsPage = () => {
  // const user = useContext(UserContext);
 

  const [open, setOpen] = useState(false);
  const [mediaType, setMediaType] = useState("");
  const [targetPost, setTargetPost] = useState<post>();

  const { posts,currentUser } = useContext(StoreContext);

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    posts.getUserPosts(currentUser.signedUser?.uid);
  }, [currentUser.signedUser.uid, posts.userPosts]);



  

  return (
    <div className="grid grid-cols-3 gap-2">
      {posts.userPosts.length > 0
        ? posts.userPosts.map((post) =>
            post.mediaType.slice(0, 5) === "image" ? (
              <img
                key={post.id}
                src={post.media}
                alt=""
                className="cursor-pointer w-full aspect-square object-cover"
                onClick={(e) => {
                  // setMediaSrc(e.target.src);
                  setTargetPost(post);
                  setOpen(true);
                  setMediaType("image");
                }}
              />
            ) : (
              <div
                onClick={(e) => {
                  // setMediaSrc(e.target.children[0].src);
                  setTargetPost(post);
                  setOpen(true);
                  setMediaType("video");
                }}
                className="cursor-pointer relative w-full aspect-square  flex justify-center items-center"
              >
                <video
                  key={post.id}
                  className="w-full aspect-square object-cover"
                  muted
                >
                  <source src={post.media} type="video/mp4" />
                </video>
                <MovieOutlined className="absolute top-2 right-2 text-white text-2xl" />
              </div>
            )
          )
        : ""}
      {open && (
        <PostModal
          user={currentUser.signedUser}
          open={open}
          close={handleClose}
          mediaType={mediaType}
          targetPostId={targetPost.id}
        />
      )}
    </div>
  );
};

export default observer(ProfilePostsPage);
