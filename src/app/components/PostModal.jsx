"use client";
import {
  BookmarkBorderOutlined,
  ChatBubbleOutlineOutlined,
  FavoriteBorderOutlined,
  SendOutlined,
  SentimentSatisfiedOutlined,
  SentimentSatisfiedOutlinedIcon,
} from "@mui/icons-material";
import {
  Avatar,
  Divider,
  Modal,
  Paper,
  Stack,
  IconButton,
  Box,
  Skeleton,
  Snackbar,
  Alert,
  CircularProgress,
  Backdrop,
} from "@mui/material";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import Image from "next/image";
import React, { use, useEffect, useState } from "react";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";

import { doc, updateDoc } from "firebase/firestore";

import { db } from "../firebase/FireBase-config";

import { v4 as uuidv4 } from "uuid";

export default function PostModal({
  open,
  close,
  user,
  mediaType,
  targetPost,
}) {
  const [inputComment, setInputComment] = useState("");
  const [emojiClicked, setEmojiClicked] = useState(false);
  const [commentLoading, setCommentLoading] = useState(false);
  const [alertMessage, setAlertMessage] = useState(null);

  const addComment = (postId, comment, user) => {
    const commentRef = doc(db, "posts", postId);

    // console.log("comment reference", commentRef);

    const commentData = {
      id: uuidv4(),
      content: comment,
      author: {
        id: `${user.id}`,
        name: user.displayName,
        avatar: user.photoURL,
      },
    };

    updateDoc(commentRef, {
      comments: [...targetPost.comments, commentData],
    })
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

  const showSnackbar = (openState) => {
    // const [open, setOpen] = useState(openState);
    // const handleClose = () => {
    //   setOpen(false);
    // };

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
    console.log("target post :", targetPost);
    console.log("user :", user);
  }, [open]);

  useEffect(() => {
    setTimeout(() => {
      setAlertMessage(null);
    }, 6000);
  }, [alertMessage]);

  return (
    <Modal
      open={open}
      onClose={close}
      className="
      grid place-items-center border-none outline-none
    "
    >
      <Paper
        className={`bg-stone-950 font-insta  text-white rounded-md flex flex-col  items-center h-auto border-none outline-none  min-w-[30rem] w-auto`}
      >
        {alertMessage !== null && showSnackbar(true)}
        <Stack direction={"row"} className="h-[40rem] w-full">
          {mediaType === "image" ? (
            <img
              // src="/getflex3 ad.jpg"
              src={open && targetPost.media}
              alt=""
              className="h-full w-auto object-cover aspect-instaPost skeleton"
            />
          ) : (
            <video
              controls
              className="h-full w-auto object-cover aspect-instaPost "
            >
              <source src={open && targetPost.media} type="video/mp4" />
            </video>
          )}
          <div
            className="grid w-[30rem] h-[40rem] aspect-instaPost p-5 text-white   "
            style={{
              gridTemplateRows: "auto 1fr auto auto",
              gridTemplateColumns: "auto",
            }}
          >
            <Stack spacing={1}>
              <Stack direction={"row"} spacing={2} className="items-center">
                <Avatar src={open && user.photoURL} className="w-10 h-10" />
                <h1>{open && user.displayName}</h1>
              </Stack>
              <Divider className="w-full  bg-stone-900" />
            </Stack>

            <Stack spacing={1} className="py-5 h-auto overflow-auto">
              <AuthorDescription
                name={user.displayName}
                avatar={user.photoURL}
                content={targetPost.description}
              />
              <Divider className="w-full  bg-stone-900" />
              <Stack className="pl-3  h-auto">
                {open && targetPost.comments.length > 0 ? (
                  targetPost.comments.map((comment) => (
                    <Stack spacing={1} key={comment.id}>
                      <UserComment
                        name={comment.author.name}
                        avatar={comment.author.avatar}
                        content={comment.content}
                      />
                      <Divider className="w-full  bg-stone-900" />
                    </Stack>
                  ))
                ) : (
                  <h1 className="pt-5 capitalize text-lg text-white/10">
                    no comments on this post
                  </h1>
                )}
              </Stack>
            </Stack>

            <Stack spacing={2}>
              <Divider className="w-full  bg-stone-900" />

              <Stack
                direction={"row"}
                className="text-stone-950 dark:text-white justify-between items-center"
              >
                <Stack
                  direction={"row"}
                  spacing={2}
                  className="justify-center items-center"
                >
                  <FavoriteBorderOutlined
                    sx={{ fontSize: "2rem", color: "red" }}
                  />
                  <ChatBubbleOutlineOutlined sx={{ fontSize: "2rem" }} />
                  <SendOutlined
                    sx={{ fontSize: "2rem" }}
                    className="-rotate-12"
                  />
                </Stack>

                <BookmarkBorderOutlined sx={{ fontSize: "2rem" }} />
              </Stack>
              <Divider className="w-full  bg-stone-900" />
            </Stack>

            <Stack>
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
                        addComment(targetPost.id, inputComment, user);
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
                    <Box sx={{ position: "absolute", right: 0, bottom: "20%" }}>
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
          </div>
        </Stack>
      </Paper>
    </Modal>
  );
}

const UserComment = ({ name, avatar, content }) => {
  return (
    <Stack spacing={0}>
      <Stack direction={"row"} spacing={2} className="items-center">
        <Avatar src={avatar} className="w-8 h-8" />
        <h1 className="text-[.9rem]">{name}</h1>
      </Stack>
      <h3 className="pl-12 text-[.85rem] text-stone-950/95 dark:text-white/75 w-full">
        {content}
      </h3>
    </Stack>
  );
};

const AuthorDescription = ({ name, avatar, content }) => {
  return (
    <Stack spacing={0.5}>
      <Stack direction={"row"} spacing={2} className="items-center">
        <Avatar src={avatar} className="w-10 h-10" />
        <h1>{name}</h1>

        <h2 className="text-white/50 text-xs">(author)</h2>
      </Stack>
      <h3 className="pl-14 text-sm  text-white w-full">{content}</h3>
    </Stack>
  );
};
