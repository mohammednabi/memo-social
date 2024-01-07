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
import React, { use, useEffect, useState } from "react";
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
import useTargetPost from "../hooks/useTargetPost";

export default function PostModal({
  open,
  close,
  user,
  mediaType,
  targetPostId,
}) {
  const [inputComment, setInputComment] = useState("");
  const [emojiClicked, setEmojiClicked] = useState(false);
  const [commentLoading, setCommentLoading] = useState(false);
  const [alertMessage, setAlertMessage] = useState(null);

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);

  const targetPost = useTargetPost(targetPostId);

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
          {targetPost && !confirmDelete && !loadingDelete && (
            <Stack direction={"row"} className="h-[40rem] w-full">
              {mediaType.slice(0, 5) === "image" ? (
                <img
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
                        src={open && targetPost.author.avatar}
                        className="w-10 h-10"
                      />
                      <h1>{open && targetPost.author.name}</h1>
                    </Stack>
                    {user.uid === targetPost.author.id && (
                      <IconButton onClick={handleEditModalOpen}>
                        <MoreHoriz className="text-white" />
                      </IconButton>
                    )}

                    <PostSettingsModal
                      open={editModalOpen}
                      closeModal={handleEditModalClose}
                      closeMain={close}
                      post={targetPost}
                      setConfirmDelete={setConfirmDelete}
                      loadingDelete={loadingDelete}
                      setLoadingDelete={setLoadingDelete}
                    />
                  </Stack>
                  <Divider className="w-full  bg-stone-900" />
                </Stack>

                <Stack spacing={1} className="py-5 h-auto overflow-auto">
                  <AuthorDescription
                    name={targetPost.author.name}
                    avatar={targetPost.author.avatar}
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
                      spacing={1}
                      className="justify-center items-center"
                    >
                      {!targetPost.likes.includes(`${user.uid}`) ? (
                        <IconButton
                          onClick={() => {
                            toggleLove(targetPost.id, targetPost.likes, user);
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
                            toggleLove(targetPost.id, targetPost.likes, user);
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
                              targetPost.id,
                              targetPost.comments,
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

const PostSettingsModal = ({
  open,
  closeModal,
  closeMain,
  post,
  setConfirmDelete,

  setLoadingDelete,
}) => {
  const [openDeleteConfirmDialog, setOpenDeleteConfirmDialog] = useState(false);
  const [openPostEditModal, setOpenPostEditModal] = useState(false);

  const handleOpenDeleteConfirmDialog = () => {
    setOpenDeleteConfirmDialog(true);
  };

  const handleCloseDeleteConfirmDialog = () => {
    setOpenDeleteConfirmDialog(false);
  };

  const handleOpenEditPostModal = () => {
    setOpenPostEditModal(true);
  };

  const handleCloseEditPostModal = () => {
    setOpenPostEditModal(false);
  };

  const deleteWholePost = () => {
    setLoadingDelete(true);
    deletePost(post.id, post.media)
      .then(() => {
        setLoadingDelete(false);
        setConfirmDelete(true);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <>
      <Modal
        open={open}
        onClose={closeModal}
        className="
      grid place-items-center border-none outline-none
    "
      >
        <Paper
          className={`bg-stone-950 font-insta  text-2xl   text-white rounded-md   h-auto border-none outline-none  py-5  w-auto`}
        >
          <Stack spacing={2} className="items-center justify-center ">
            <button
              className="text-white/75 capitalize px-20"
              onClick={handleOpenEditPostModal}
            >
              edit
            </button>
            <Divider className="w-full  bg-stone-900" />
            <button
              className="text-red-600 capitalize px-20"
              onClick={() => {
                handleOpenDeleteConfirmDialog();
              }}
            >
              delete
            </button>
          </Stack>

          {/* confirm delete dialog  */}

          <Dialog
            open={openDeleteConfirmDialog}
            onClose={handleCloseDeleteConfirmDialog}
            PaperProps={{
              style: {
                backgroundColor: "rgb(12 10 9)",
                color: "white",
              },
            }}
            // className="bg-stone-950"
          >
            <DialogTitle>Confirm Delete</DialogTitle>
            <DialogContent>
              <DialogContentText className="text-white/75">
                Do you want to delete this post , this means that you won't be
                able to retrieve this post again ?
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button
                color="error"
                onClick={() => {
                  handleCloseDeleteConfirmDialog();
                  closeModal();

                  deleteWholePost(post.id, post.media);
                }}
              >
                Delete
              </Button>
              <Button onClick={handleCloseDeleteConfirmDialog} autoFocus>
                Cancel
              </Button>
            </DialogActions>
          </Dialog>

          {/* === confirm delete dialog === */}
        </Paper>
      </Modal>
      {openPostEditModal && (
        <EditModal
          open={openPostEditModal}
          close={handleCloseEditPostModal}
          post={post}
          closeMenu={closeModal}
        />
      )}
    </>
  );
};

const EditModal = ({ open, close, post, closeMenu }) => {
  const [inputComment, setInputComment] = useState(`${post.description}`);
  const [emojiClicked, setEmojiClicked] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [postUploaded, setPostUploaded] = useState(false);

  const updateWholePost = (description, postId) => {
    setIsUploading(true);
    updatePost(description, postId)
      .then(() => {
        setIsUploading(false);
        setPostUploaded(true);
      })
      .catch((err) => {
        console.log(err);
        alert("something went wrong while updating the post ");
        setIsUploading(false);
      });
  };

  const handleClose = () => {
    close();
    closeMenu();
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      className="
      grid place-items-center border-none outline-none
    "
    >
      <Paper
        className={`bg-stone-950 font-insta     text-white rounded-md   h-auto border-none outline-none   w-auto`}
      >
        {!postUploaded && (
          <Stack>
            <Stack
              direction={"row"}
              className=" items-center justify-between px-5"
            >
              <h1
                className="text-2xl text-center capitalize py-3 "
                style={{
                  background:
                    " linear-gradient(45deg, rgba(0,244,151,1) 0%, rgba(0,243,244,1) 57%, rgba(212,0,244,1) 100%)",
                  backgroundClip: "text",
                  color: "transparent",
                }}
              >
                {!isUploading ? "editing" : "updating"} your post{" "}
              </h1>
              {!isUploading && (
                <Button
                  color="secondary"
                  onClick={() => {
                    updateWholePost(inputComment, post.id);
                  }}
                >
                  update
                </Button>
              )}
            </Stack>

            <Divider className="w-full  bg-stone-900" />
            <Stack direction={"row"} className=" h-[35rem] relative">
              {isUploading && (
                <div className="bg-black/75 w-full h-full absolute z-10 ">
                  <LinearProgress
                    color="secondary"
                    className=""
                    sx={{
                      background:
                        " linear-gradient(45deg, rgba(0,244,151,1) 0%, rgba(0,243,244,1) 57%, rgba(212,0,244,1) 100%)",
                    }}
                  />
                </div>
              )}
              <div className="h-full w-auto aspect-square">
                {post.mediaType.slice(0, 5) === "image" && (
                  <img
                    src={post.media}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                )}
                {post.mediaType.slice(0, 5) === "video" && (
                  <video
                    controls
                    autoPlay
                    muted
                    loop
                    className="w-full h-full object-contain"
                  >
                    <source src={post.media} type="video/mp4" />
                  </video>
                )}
              </div>
              <Stack>
                <div className="flex gap-2 p-5 justify-start items-center">
                  <Avatar
                    src={post.author.avatar}
                    alt=""
                    className="w-10 h-10"
                  />
                  <h1>{post.author.name}</h1>
                </div>
                <textarea
                  placeholder="Write Your Caption"
                  value={inputComment}
                  onChange={(e) => {
                    if (inputComment.length <= 200) {
                      setInputComment(e.target.value);
                    }

                    // else
                    // {
                    //   window.addEventListener("keydown", (e) => {
                    //     if (e.key === "Backspace") {
                    //       const editInput = inputComment.slice(
                    //         0,
                    //         inputComment.length - 1
                    //       );
                    //       setInputComment(editInput);
                    //     }
                    //     return;
                    //   });
                    // }
                  }}
                  className="min-w-[20rem] w-full h-1/2 resize-none bg-stone-950 border-none outline-none px-5 py-0 text-stone-500"
                />
                <Stack justifyContent={""}>
                  <div className="flex gap-2 p-5 justify-between items-center text-stone-600">
                    <IconButton
                      onClick={() => {
                        setEmojiClicked(!emojiClicked);
                      }}
                    >
                      <SentimentSatisfiedOutlined className="text-stone-600 text-lg cursor-pointer" />
                    </IconButton>
                    <h1>{inputComment.length}/200</h1>
                  </div>
                  {emojiClicked && (
                    <Box
                      sx={{ overflow: "auto", height: "15rem", width: "100%" }}
                    >
                      <Picker
                        data={data}
                        theme={"auto"}
                        set={"native"}
                        onEmojiSelect={(e) => {
                          setInputComment(inputComment + e.native);
                          setEmojiClicked(false);
                        }}
                      />
                    </Box>
                  )}
                </Stack>
              </Stack>
            </Stack>
          </Stack>
        )}

        {postUploaded && <SuccessfulUpdatedPost />}
      </Paper>
    </Modal>
  );
};

const SuccessfulDeletePost = () => {
  return (
    <Stack className=" h-[25rem] justify-center capitalize items-center gap-3 p-3">
      <h1
        className="text-5xl font-bold text-center "
        style={{
          background:
            " linear-gradient(45deg, rgba(0,244,151,1) 0%, rgba(0,243,244,1) 57%, rgba(212,0,244,1) 100%)",
          backgroundClip: "text",
          color: "transparent",
        }}
      >
        <span className="text-white text-xl">✨</span> done{" "}
        <span className="text-white text-xl">✨</span>
      </h1>
      <h2 className="text-lg text-stone-400 text-center">
        your post was deleted successfully{" "}
      </h2>
    </Stack>
  );
};

const SuccessfulUpdatedPost = () => {
  return (
    <Stack className=" h-[25rem] justify-center capitalize items-center gap-3 p-3 px-10">
      <h1
        className="text-5xl font-bold text-center "
        style={{
          background:
            " linear-gradient(45deg, rgba(0,244,151,1) 0%, rgba(0,243,244,1) 57%, rgba(212,0,244,1) 100%)",
          backgroundClip: "text",
          color: "transparent",
        }}
      >
        <span className="text-white text-xl">✨</span> congratulations{" "}
        <span className="text-white text-xl">✨</span>
      </h1>
      <h2 className="text-lg text-stone-400 text-center">
        your post was updated successfully{" "}
      </h2>
    </Stack>
  );
};
