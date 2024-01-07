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
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import { collection, getDocs } from "firebase/firestore";
import { postsCol } from "../firebase/FireBase-config";
import usePosts from "../hooks/usePosts";
import LoadMoreLoader from "./LoadMoreLoader";
import { UserContext } from "../contexts/user";
import PostModal from "./PostModal";
import { addingComment, toggleLove } from "../functions/updateDocument";

export default function PostsSection() {
  const posts = usePosts();

  const [index, setIndex] = useState(4);
  const [targetPost, setTargetPost] = useState({ likes: 0 });
  const [open, setOpen] = useState(false);
  const user = useContext(UserContext);

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleTargetPost = (post) => {
    setTargetPost(post);
  };

  const increaseIndex = () => {
    setIndex((i) => {
      return i + 4;
    });
  };

  return (
    <section className="flex flex-col gap-5 mt-5">
      {posts.length > 0 ? (
        posts.map(
          (post, postIndex) =>
            postIndex < index && (
              <div key={post.id}>
                <Post
                  post={post}
                  handleOpen={handleOpen}
                  handleTargetPost={handleTargetPost}
                  user={user}
                  toggleLove={toggleLove}
                />

                <hr className="opacity-100 dark:opacity-10" />
              </div>
            )
        )
      ) : (
        <PostSkeleton />
      )}
      {index < posts.length && <LoadMoreLoader increaseIndex={increaseIndex} />}
      {open && (
        <PostModal
          user={user}
          open={open}
          close={handleClose}
          mediaType={targetPost.mediaType}
          targetPostId={targetPost.id}
        />
      )}
    </section>
  );
}

const Post = ({ post, handleOpen, handleTargetPost, user }) => {
  const [inputComment, setInputComment] = useState("");
  const [emojiClicked, setEmojiClicked] = useState(false);
  const [videoPaused, setVideoPaused] = useState(true);
  const [videpAudioMuted, setVidepAudioMuted] = useState(false);
  const [commentLoading, setCommentLoading] = useState(false);
  const [alertMessage, setAlertMessage] = useState(null);

  const timeNow = new Date();
  const videoRef = useRef();

  const calculateTime = () => {
    const timeDifference = Math.floor(
      (timeNow.getTime() - post.timestamp.created.time) / 1000
    ); // Calculate the time difference in seconds

    const daysDifference = Math.floor(timeDifference / (24 * 60 * 60));
    const hoursDifference = Math.floor((timeDifference / (60 * 60)) % 24);
    const minutesDifference = Math.floor((timeDifference / 60) % 60);
    const secondsDifference = Math.floor(timeDifference % 60);

    if (daysDifference > 0) {
      return (
        <h3 className="text-stone-950/50 dark:text-white/25">
          {daysDifference} d
        </h3>
      );
    } else if (hoursDifference > 0) {
      return (
        <h3 className="text-stone-950/50 dark:text-white/25">
          {hoursDifference} h
        </h3>
      );
    } else if (minutesDifference > 0) {
      return (
        <h3 className="text-stone-950/50 dark:text-white/25">
          {minutesDifference} m
        </h3>
      );
    } else if (secondsDifference > 0) {
      return (
        <h3 className="text-stone-950/50 dark:text-white/25">
          {secondsDifference} s
        </h3>
      );
    }
  };

  const addComment = (postId, comments, comment, user) => {
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
    <Stack spacing={2} className="font-insta w-112">
      {alertMessage !== null && showSnackbar(true)}
      <Stack direction={"row"} className="     items-center" spacing={1}>
        <Avatar src={post.author.avatar} />
        <h1 className="text-stone-950 dark:text-white font-semibold">
          {post.author.name}
        </h1>
        <Stack direction={"row"} spacing={0.5}>
          <h2 className="text-stone-950/50 dark:text-white/25 ">● </h2>
          {calculateTime()}
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
              <PlayArrow className="text-7xl  text-white" />
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
          {!post.likes.includes(`${user.uid}`) ? (
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
            <ChatBubbleOutlineOutlinedIcon
              className="cursor-pointer transition-colors text-white hover:text-white/50"
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
          <BookmarkBorderOutlinedIcon
            className="cursor-pointer text-white transition-colors hover:text-white/50"
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
              <h1 className="text-white text-lg">
                {post.comments[post.comments.length - 1].author.name}
              </h1>
            </Stack>
            <p className="text-white/60 pl-10">
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
              <SentimentSatisfiedOutlinedIcon className="text-stone-950 dark:text-white text-lg cursor-pointer" />
            </IconButton>
            {emojiClicked && (
              <Box sx={{ position: "absolute", right: "50%" }}>
                <Picker
                  data={data}
                  onEmojiSelect={(e) => {
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

const PostSkeleton = () => {
  return (
    <Stack spacing={2} className="font-insta mb-10">
      <Stack direction={"row"} className="     items-center" spacing={1}>
        <Skeleton variant="circular" className="skeleton">
          <Avatar src="" />
        </Skeleton>
        <Skeleton variant="rounded" className="skeleton">
          <h1 className="text-white font-semibold">mohammed nabil</h1>
        </Skeleton>
        <Skeleton variant="rounded" className="skeleton">
          <Stack direction={"row"}>
            <h2 className="text-white/25">.</h2>
            <h3 className="text-white/25"> 5 m</h3>
          </Stack>
        </Skeleton>
      </Stack>
      <Skeleton variant="rectangular" className="skeleton">
        <div className="w-112 aspect-square">
          <img
            className="w-full h-full object-cover rounded-md"
            alt=""
            src=""
            loading="lazy"
          />
        </div>
      </Skeleton>

      <Skeleton variant="rounded" className="skeleton">
        <Stack
          direction={"row"}
          className="text-white justify-between items-center"
        >
          <Stack
            direction={"row"}
            spacing={2}
            className="justify-center items-center"
          >
            <FavoriteBorderOutlined sx={{ fontSize: "2rem", color: "red" }} />
            <ChatBubbleOutlineOutlinedIcon sx={{ fontSize: "2rem" }} />
            <SendOutlinedIcon
              sx={{ fontSize: "2rem" }}
              className="-rotate-12"
            />
          </Stack>

          <BookmarkBorderOutlinedIcon sx={{ fontSize: "2rem" }} />
        </Stack>
      </Skeleton>
      {/* <Stack spacing={1}>
        <Skeleton variant="rounded" className="skeleton">
          <h2 className="text-white/95">6,589 likes</h2>
        </Skeleton>
        <Skeleton variant="rounded" className="skeleton">
          <h1 className="text-white/95">this is a description for the post </h1>
        </Skeleton>
        <Skeleton variant="rounded" className="skeleton">
          <h2 className="text-white/60">View all comments</h2>
        </Skeleton>
      </Stack> */}
    </Stack>
  );
};
