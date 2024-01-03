"use client";
import {
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
  Avatar,
  Box,
  Button,
  Divider,
  IconButton,
  Skeleton,
  Stack,
} from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import { collection, getDocs } from "firebase/firestore";
import { postsCol } from "../firebase/FireBase-config";
import usePosts from "../hooks/usePosts";
import LoadMoreLoader from "./LoadMoreLoader";

export default function PostsSection() {
  const posts = usePosts();

  const [index, setIndex] = useState(4);

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
                <Post post={post} />

                <hr className="opacity-100 dark:opacity-10" />
              </div>
            )
        )
      ) : (
        <PostSkeleton />
      )}
      {index < posts.length && <LoadMoreLoader increaseIndex={increaseIndex} />}
    </section>
  );
}

const Post = ({ post }) => {
  const [inputComment, setInputComment] = useState("");
  const [emojiClicked, setEmojiClicked] = useState(false);
  const [videoPaused, setVideoPaused] = useState(true);
  const [videpAudioMuted, setVidepAudioMuted] = useState(false);
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

  return (
    <Stack spacing={2} className="font-insta w-112">
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
          spacing={2}
          className="justify-center items-center"
        >
          <FavoriteBorderOutlined sx={{ fontSize: "2rem", color: "red" }} />
          <ChatBubbleOutlineOutlinedIcon sx={{ fontSize: "2rem" }} />
          <SendOutlinedIcon sx={{ fontSize: "2rem" }} className="-rotate-12" />
        </Stack>

        <BookmarkBorderOutlinedIcon sx={{ fontSize: "2rem" }} />
      </Stack>
      <Stack spacing={1}>
        <h2 className="text-stone-950/95 dark:text-white/95">
          {post.likes.length} likes
        </h2>
        <h1 className="text-stone-950/95 dark:text-white/95 w-full">
          {post.description}
        </h1>
        <h2 className="text-stone-950/60 dark:text-white/60">
          View all comments
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
              <button className="text-blue-600 capitalize ">post</button>
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
