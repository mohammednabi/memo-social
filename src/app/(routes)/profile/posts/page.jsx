"use client";

import PostModal from "@/app/components/PostModal";
import { UserContext } from "@/app/contexts/user";
import { db, getPosts } from "@/app/firebase/FireBase-config";
import usePosts from "@/app/hooks/usePosts";
import { Movie, MovieOutlined } from "@mui/icons-material";

import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import React, { useContext, useEffect, useState } from "react";

export default function ProfilePostsPage() {
  const posts = usePosts();
  const user = useContext(UserContext);
  const [userPosts, setUserPosts] = useState([]);
  const [mediaSrc, setMediaSrc] = useState("");
  const [open, setOpen] = useState(false);
  const [mediaType, setMediaType] = useState("");
  const [targetPost, setTargetPost] = useState();

  const getUserPosts = () => {
    if (user && posts) {
      const allUserPosts = posts.filter((post) => {
        return post.author.id === user.uid;
      });

      setUserPosts(allUserPosts);
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    getUserPosts();
  }, [user, posts]);

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
          targetPost={targetPost}
        />
      )}
    </div>
  );
}
