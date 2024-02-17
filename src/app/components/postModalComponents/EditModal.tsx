"use client";
// import { updatePost } from "@/app/functions/updateDocument";
import { updatePost } from "../../functions/updateDocument";
import {
  Avatar,
  Box,
  Button,
  Divider,
  IconButton,
  LinearProgress,
  Modal,
  Paper,
  Stack,
} from "@mui/material";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import React, { useState } from "react";
import SuccessfulUpdatedPost from "./SuccessfulUpdatedPost";
import { SentimentSatisfiedOutlined } from "@mui/icons-material";

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

export default EditModal;
