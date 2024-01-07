"use client";

import PostModal from "@/app/components/PostModal";
import { UserContext } from "@/app/contexts/user";
import { db, getPosts } from "@/app/firebase/FireBase-config";
import usePosts from "@/app/hooks/usePosts";
import useTargetPost from "@/app/hooks/useTargetPost";
import useUserPosts from "@/app/hooks/useUserPosts";
import { Movie, MovieOutlined } from "@mui/icons-material";

import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import React, { useContext, useEffect, useState } from "react";

export default function ProfilePostsPage() {
  const user = useContext(UserContext);

  const [open, setOpen] = useState(false);
  const [mediaType, setMediaType] = useState("");
  const [targetPost, setTargetPost] = useState();

  const userPosts = useUserPosts();

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div className="grid grid-cols-3 gap-2">
      {userPosts.length > 0
        ? userPosts.map((post) =>
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
          user={user}
          open={open}
          close={handleClose}
          mediaType={mediaType}
          targetPostId={targetPost.id}
        />
      )}
    </div>
  );
}
