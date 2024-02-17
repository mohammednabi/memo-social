"use client";
import {
  Favorite,
  FavoriteBorderOutlined,
  PlayArrow,
  VoiceChat,
  VolumeOff,
  VolumeUp,
} from "@mui/icons-material";
import ChatBubbleOutlineOutlinedIcon from "@mui/icons-material/ChatBubbleOutlineOutlined";
import SendOutlinedIcon from "@mui/icons-material/SendOutlined";
import BookmarkBorderOutlinedIcon from "@mui/icons-material/BookmarkBorderOutlined";
import SentimentSatisfiedOutlinedIcon from "@mui/icons-material/SentimentSatisfiedOutlined";
import {
  Alert,
  Avatar,
  Backdrop,
  Box,
  Button,
  CircularProgress,
  Divider,
  IconButton,
  Skeleton,
  Snackbar,
  Stack,
} from "@mui/material";
import React, { useContext, useEffect, useRef, useState } from "react";

import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import { collection, getDocs } from "firebase/firestore";
import { postsCol } from "../firebase/FireBase-config";

import LoadMoreLoader from "./LoadMoreLoader";
// import { UserContext } from "../contexts/user";
import PostModal from "./PostModal";
import { addingComment, toggleLove } from "../functions/updateDocument";
import { observer } from "mobx-react-lite";
import { StoreContext } from "../contexts/StoreContext";
import Post from "./postSectionComponents/Post";
import PostSkeleton from "./postSectionComponents/PostSkeleton";
// import { post } from "@/stores/generalCustomTypes";
import { post } from "../../stores/generalCustomTypes";

const PostsSection = () => {
  // const posts = usePosts();
  // const posts = [];

  const { posts } = useContext(StoreContext);

  const [index, setIndex] = useState(4);
  const [targetPost, setTargetPost] = useState<post>();
  const [open, setOpen] = useState(false);
  // const user = useContext(UserContext);
const {currentUser} = useContext(StoreContext)

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleTargetPost = (post: React.SetStateAction<post>) => {
    setTargetPost(post);
  };

  const increaseIndex = () => {
    setIndex((i) => {
      return i + 4;
    });
  };

  useEffect(() => {
    posts.getAllPosts();
  }, [posts.allPosts]);

  return (
    <section className="flex flex-col gap-5 mt-5">
      {posts.allPosts.length > 0 ? (
        posts.allPosts.map(
          (post, postIndex) =>
            postIndex < index && (
              <div key={post.id}>
                <Post
                  post={post}
                  handleOpen={handleOpen}
                  handleTargetPost={handleTargetPost}
                  user={currentUser.signedUser}
                  toggleLove={toggleLove}
                />

                <hr className="opacity-100 dark:opacity-10" />
              </div>
            )
        )
      ) : (
        <PostSkeleton />
      )}
      {index < posts.allPosts.length && (
        <LoadMoreLoader increaseIndex={increaseIndex} />
      )}
      {open && (
        <PostModal
          user={currentUser.signedUser}
          open={open}
          close={handleClose}
          mediaType={targetPost.mediaType}
          targetPostId={targetPost.id}
        />
      )}
    </section>
  );
};





export default observer(PostsSection);
