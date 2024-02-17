"use client";
import {
  BookmarkBorderOutlined,
  ChatBubbleOutlineOutlined,
  Favorite,
  FavoriteBorderOutlined,
  MoreHoriz,
  SendOutlined,
  SentimentSatisfiedOutlined,
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
  MenuList,
  MenuItem,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContentText,
  DialogContent,
  DialogActions,
  Button,
  LinearProgress,
} from "@mui/material";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import Image from "next/image";
import React, { use, useContext, useEffect, useState } from "react";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";

import { doc, updateDoc } from "firebase/firestore";

import { db } from "../firebase/FireBase-config";

import { v4 as uuidv4 } from "uuid";
import {
  addingComment,
  deletePost,
  toggleLove,
  updatePost,
} from "../functions/updateDocument";

import PostSettingsModal from "./postModalComponents/PostSettingsModal";
import AuthorDescription from "./postModalComponents/AuthorDescription";
import UserComment from "./postModalComponents/UserComment";
import SuccessfulDeletePost from "./postModalComponents/SuccessfulDeletePost";
import { StoreContext } from "../contexts/StoreContext";
import { defaultUser } from "../../stores/generalCustomTypes";

interface iProps{
  open: any
  close: any
  user:defaultUser
  mediaType:string
  targetPostId:string
}

export default function PostModal({
  open,
  close,
  user,
  mediaType,
  targetPostId,
}:iProps) {
  const [inputComment, setInputComment] = useState("");
  const [emojiClicked, setEmojiClicked] = useState(false);
  const [commentLoading, setCommentLoading] = useState(false);
  const [alertMessage, setAlertMessage] = useState(null);

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);

  // const targetPost = useTargetPost(targetPostId);
const {posts} = useContext(StoreContext)


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


  useEffect(() => {
    posts.getTargetPost(targetPostId)
    
  },[targetPostId])


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

  const handleEditModalOpen = () => {
    setEditModalOpen(true);
  };

  const handleEditModalClose = () => {
    setEditModalOpen(false);
  };

  useEffect(() => {
    setTimeout(() => {
      setAlertMessage(null);
    }, 6000);
  }, [alertMessage]);

  return (
    <>
      <Modal
        open={open}
        onClose={close}
        className="
      grid place-items-center border-none outline-none
    "
      >
        <Paper
          className={`bg-stone-950 font-insta flex flex-col items-center text-white rounded-md  h-auto border-none outline-none  min-w-[30rem] w-auto`}
        >
          {alertMessage !== null && showSnackbar(true)}
          { posts.targetPost && !confirmDelete && !loadingDelete && (
            <Stack direction={"row"} className="h-[40rem] w-full">
              {mediaType.slice(0, 5) === "image" ? (
                <img
                  src={open && posts.targetPost.media}
                  alt=""
                  className="h-full w-auto object-cover aspect-instaPost skeleton"
                />
              ) : (
                <video
                  controls
                  className="h-full w-auto object-cover aspect-instaPost "
                >
                  <source src={open && posts.targetPost.media} type="video/mp4" />
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
                  <Stack
                    direction={"row"}
                    className="items-center justify-between"
                  >
                    <Stack
                      direction={"row"}
                      spacing={2}
                      className="items-center"
                    >
                      <Avatar
                        src={open && posts.targetPost.author.avatar}
                        className="w-10 h-10"
                      />
                      <h1>{open && posts.targetPost.author.name}</h1>
                    </Stack>
                    {user.uid === posts.targetPost.author.id && (
                      <IconButton onClick={handleEditModalOpen}>
                        <MoreHoriz className="text-white" />
                      </IconButton>
                    )}

                    <PostSettingsModal
                      open={editModalOpen}
                      closeModal={handleEditModalClose}
                      closeMain={close}
                      post={posts.targetPost}
                      setConfirmDelete = {setConfirmDelete}
                      loadingDelete = {loadingDelete}
                      setLoadingDelete={setLoadingDelete}
                    />
                  </Stack>
                  <Divider className="w-full  bg-stone-900" />
                </Stack>

                <Stack spacing={1} className="py-5 h-auto overflow-auto">
                  <AuthorDescription
                    name={posts.targetPost.author.name}
                    avatar={posts.targetPost.author.avatar}
                    content={posts.targetPost.description}
                  />
                  <Divider className="w-full  bg-stone-900" />
                  <Stack className="pl-3  h-auto">
                    {open && posts.targetPost.comments.length > 0 ? (
                      posts.targetPost.comments.map((comment) => (
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
                      spacing={1}
                      className="justify-center items-center"
                    >
                      {!posts.targetPost.likes.includes(`${user.uid}`) ? (
                        <IconButton
                          onClick={() => {
                            toggleLove(posts.targetPost.id, posts.targetPost.likes, user);
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
                            toggleLove(posts.targetPost.id, posts.targetPost.likes, user);
                          }}
                        >
                          <Favorite
                            className="cursor-pointer transition-colors text-red-800 hover:text-red-800/50"
                            sx={{ fontSize: "2rem" }}
                          />
                        </IconButton>
                      )}
                      <IconButton>
                        <ChatBubbleOutlineOutlined
                          className="cursor-pointer transition-colors text-white hover:text-white/50"
                          sx={{ fontSize: "1.6rem" }}
                        />
                      </IconButton>
                    </Stack>

                    <IconButton>
                      <BookmarkBorderOutlined
                        className="text-white cursor-pointer transition-colors hover:text-white/50"
                        sx={{ fontSize: "2rem" }}
                      />
                    </IconButton>
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
                            addComment(
                              posts.targetPost.id,
                              posts.targetPost.comments,
                              inputComment,
                              user
                            );
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
                        <Box
                          sx={{ position: "absolute", right: 0, bottom: "20%" }}
                        >
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
          )}
          {loadingDelete && !confirmDelete && (
            <Stack spacing={2} className="bg-stone-950 h-[20rem] w-full">
              <h1
                className="text-2xl text-center pt-5 capitalize font-insta"
                style={{
                  background:
                    " linear-gradient(45deg, rgba(0,244,151,1) 0%, rgba(0,243,244,1) 57%, rgba(212,0,244,1) 100%)",
                  backgroundClip: "text",
                  color: "transparent",
                }}
              >
                deleting your post{" "}
              </h1>
              <div className="bg-black/75 w-full h-full  ">
                <LinearProgress
                  color="secondary"
                  className=""
                  sx={{
                    background:
                      " linear-gradient(45deg, rgba(0,244,151,1) 0%, rgba(0,243,244,1) 57%, rgba(212,0,244,1) 100%)",
                  }}
                />
              </div>
              <img
                src="https://cdn.dribbble.com/users/224485/screenshots/2125581/deleting.gif"
                className="w-auto h-full"
              />
            </Stack>
          )}
          {!loadingDelete && confirmDelete && <SuccessfulDeletePost />}
        </Paper>
      </Modal>
    </>
  );
}
