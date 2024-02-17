"use client "
// import { addingComment, toggleLove } from "@/app/functions/updateDocument";
import { addingComment,toggleLove } from "../../functions/updateDocument";

import React, { useEffect, useRef, useState } from "react";
import TimeOfPost from "./TimeOfPost";
// import { post } from "@/stores/generalCustomTypes";
import { post } from "../../../stores/generalCustomTypes";

import { Alert, Avatar, Backdrop, Box, CircularProgress, IconButton, Snackbar, Stack } from "@mui/material";
import { BookmarkBorderOutlined, ChatBubbleOutlineOutlined, Favorite, FavoriteBorderOutlined, PlayArrow, SentimentSatisfiedOutlined, VolumeOff, VolumeUp } from "@mui/icons-material";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";


interface iprops {
    post: post
    handleOpen: () => void
    handleTargetPost: (post: React.SetStateAction<post>) => void
    user: any
    toggleLove:(postId: string, likes: string[], user: {    uid: string;}) => void
}


const Post = ({ post, handleOpen, handleTargetPost, user ,toggleLove}:iprops) => {
  const [inputComment, setInputComment] = useState("");
  const [emojiClicked, setEmojiClicked] = useState(false);
  const [videoPaused, setVideoPaused] = useState(true);
  const [videpAudioMuted, setVidepAudioMuted] = useState(false);
  const [commentLoading, setCommentLoading] = useState(false);
  const [alertMessage, setAlertMessage] = useState(null);

 
  const videoRef = useRef<HTMLVideoElement|null>(null);



  const addComment = (postId: string, comments: { author: { avatar: string; email: string; id: string; name: string; }; content: string; id: string; }[], comment: string, user: { uid: any; displayName: any; photoURL: any; }) => {
    addingComment(postId, comments, comment, user)
      .then(() => {
        setCommentLoading(false);
        setAlertMessage("success");
        setInputComment("");
      })
      .catch((err) => {
        console.log("error adding comment", err);
        setCommentLoading(false);
        setAlertMessage("failed");
      });
  };

  const toggleVideoPause = () => {
    if (videoPaused) {
      videoRef.current.pause();
    }

    if (!videoPaused) {
      videoRef.current.play();
    }
    setVideoPaused(!videoPaused);
  };
  const toggleVideoAudio = () => {
    if (videpAudioMuted) {
      videoRef.current.muted = true;
    }
    if (!videpAudioMuted) {
      videoRef.current.muted = false;
    }
    setVidepAudioMuted(!videpAudioMuted);
  };

  const showSnackbar = (openState) => {
    return (
      <Snackbar open={openState} autoHideDuration={6000}>
        {alertMessage === "success" ? (
          <Alert
            severity="success"
            sx={{ width: "100%", background: "#68c468", color: "white" }}
          >
            Comment Added
          </Alert>
        ) : (
          <Alert
            severity="error"
            sx={{ width: "100%", background: "#ba3439", color: "white" }}
          >
            failed to add Comment
          </Alert>
        )}
      </Snackbar>
    );
  };

  useEffect(() => {
    setTimeout(() => {
      setAlertMessage(null);
    }, 6000);
  }, [alertMessage]);

  return (
    <Stack
      spacing={2}
      sx={{
        fontFamily: "insta",
        width: "30rem",
      }}
    >
      {alertMessage !== null && showSnackbar(true)}
      <Stack direction={"row"} className="     items-center" spacing={1}>
        <Avatar src={post.author.avatar} />
        <h1 className="text-stone-950 dark:text-white font-semibold">
          {post.author.name}
        </h1>
        <Stack direction={"row"} spacing={0.5}>
          <h2 className="text-stone-950/50 dark:text-white/25 ">● </h2>
                  {/* {calculateTime()} */}
                  
                  <TimeOfPost createdTime={post.timestamp.created.time} createdDate={post.timestamp.created.date } />

        </Stack>
      </Stack>
      <div className="w-112 aspect-square">
        {post.mediaType.slice(0, 5) === "image" && (
          <img
            className="w-full h-full object-cover rounded-md"
            alt=""
            src={post.media}
            loading="lazy"
          />
        )}
        {post.mediaType.slice(0, 5) === "video" && (
          <div className="cursor-pointer grid place-items-center w-full aspect-square relative">
            <video
              ref={videoRef}
              autoPlay
              muted
              loop
              className="w-full h-full object-contain "
              onClick={() => {
                toggleVideoPause();
              }}
            >
              <source src={post.media} type="video/mp4" />
            </video>

            <IconButton
              className={`absolute  transition-all ${
                !videoPaused ? "opacity-100" : "opacity-0"
              }    z-10`}
              onClick={() => {
                toggleVideoPause();
              }}
            >
              <PlayArrow className="text-7xl text-white" />
            </IconButton>

            <IconButton
              className={`absolute bottom-0 right-0 transition-all   z-10 bg-stone-800`}
              onClick={toggleVideoAudio}
            >
              {!videpAudioMuted && (
                <VolumeOff className="text-3xl  text-white" />
              )}
              {videpAudioMuted && <VolumeUp className="text-3xl  text-white" />}
            </IconButton>
          </div>
        )}
      </div>
      <Stack
        direction={"row"}
        className="text-stone-950 dark:text-white justify-between items-center"
      >
        <Stack
          direction={"row"}
          spacing={1}
          className="justify-center items-center"
        >
          {!post?.likes.includes(`${user?.uid}`) ? (
            <IconButton
              onClick={() => {
                toggleLove(post.id, post.likes, user);
              }}
            >
              <FavoriteBorderOutlined
                className="cursor-pointer transition-colors text-red-800 hover:text-red-800/50"
                sx={{ fontSize: "2rem" }}
              />
            </IconButton>
          ) : (
            <IconButton
              onClick={() => {
                toggleLove(post.id, post.likes, user);
              }}
            >
              <Favorite
                className="cursor-pointer transition-colors text-red-800 hover:text-red-800/50"
                sx={{ fontSize: "2rem" }}
              />
            </IconButton>
          )}
          <IconButton
            onClick={() => {
              handleOpen();
              handleTargetPost(post);
            }}
          >
            <ChatBubbleOutlineOutlined
              className="cursor-pointer transition-colors text-stone-950  dark:text-white  hover:text-stone-950/50 dark:hover:text-white/50"
              sx={{ fontSize: "1.6rem" }}
            />
          </IconButton>
          {/* <IconButton>
            <SendOutlinedIcon
              className="cursor-pointer transition-colors text-white hover:text-white/50"
              sx={{ fontSize: "1.6rem" }}
            />
          </IconButton> */}
        </Stack>

        <IconButton>
          <BookmarkBorderOutlined
            className="cursor-pointer text-stone-950  dark:text-white transition-colors hover:text-stone-950/50 dark:hover:text-white/50"
            sx={{ fontSize: "2rem" }}
          />
        </IconButton>
      </Stack>
      <Stack spacing={1}>
        <h2 className="text-stone-950/95 dark:text-white/95">
          {post.likes.length} likes
        </h2>
        <h1 className="text-stone-950/95 dark:text-white/95 w-full">
          {post.description}
        </h1>
        {post.comments.length > 0 && (
          <Stack spacing={-1} className="w-full">
            <Stack direction={"row"} spacing={1} className="w-full">
              <Avatar
                src={post.comments[post.comments.length - 1].author.avatar}
                className="w-8 h-8"
              />
              <h1 className="text-stone-950 dark:text-white text-lg">
                {post.comments[post.comments.length - 1].author.name}
              </h1>
            </Stack>
            <p className="text-stone-950/60 dark:text-white/60 pl-10">
              {post.comments[post.comments.length - 1].content}
            </p>
          </Stack>
        )}
        <h2
          className="text-stone-950/60 dark:text-white/60 cursor-pointer"
          onClick={() => {
            handleOpen();
            handleTargetPost(post);
          }}
        >
          View all {post.comments.length > 0 && post.comments.length} comments
        </h2>
        <Grid2 container>
          <Grid2 xs={inputComment.length > 0 ? 10 : 11}>
            <input
              value={inputComment}
              placeholder="Add a comment..."
              className="w-full h-10 p-3 pl-0 text-stone-950/90 dark:text-white/90 bg-transparent border-none outline-none resize-none"
              onChange={(e) => {
                setInputComment(e.target.value);
              }}
            />
          </Grid2>
          <Grid2
            xs={inputComment.length > 0 ? 2 : 1}
            container
            sx={{ display: "flex", gap: "" }}
          >
            {inputComment.length > 0 && (
              <button
                className="text-blue-600 capitalize "
                onClick={() => {
                  setCommentLoading(true);
                  addComment(post.id, post.comments, inputComment, user);
                }}
              >
                post
              </button>
            )}
            {inputComment.length > 0 && commentLoading && (
              <Backdrop open={true} className="text-white">
                <CircularProgress color="inherit" size={100} />
              </Backdrop>
            )}
            <IconButton
              onClick={() => {
                setEmojiClicked(!emojiClicked);
              }}
            >
              <SentimentSatisfiedOutlined className="text-stone-950 dark:text-white text-lg cursor-pointer" />
            </IconButton>
            {emojiClicked && (
              <Box sx={{ position: "absolute", right: "50%" }}>
                <Picker
                  data={data}
                  onEmojiSelect={(e: { native: string; }) => {
                    setInputComment(inputComment + e.native);
                    setEmojiClicked(false);
                  }}
                />
              </Box>
            )}
          </Grid2>
        </Grid2>
      </Stack>
    </Stack>
  );
};



export default Post