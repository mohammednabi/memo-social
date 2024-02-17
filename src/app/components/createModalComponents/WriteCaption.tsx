"use client "

import { SentimentSatisfiedOutlined } from "@mui/icons-material";
import { Avatar, Box, IconButton, LinearProgress, Stack } from "@mui/material";
import React, { useContext } from "react";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import { StoreContext } from "../../contexts/StoreContext";
import { observer } from "mobx-react-lite";

const WriteCaption = ({

}) => {


  const {newPost,currentUser} = useContext(StoreContext)


  return (
    <Stack direction={"row"} className=" h-[30rem] relative">
      {newPost.isUploading && (
        <div className="bg-black/75 w-full h-full absolute z-10 ">
          <LinearProgress
           color="secondary"
            className="bg-stone-800 "
          
            classes={{
              bar: "bg-gradient-to-r from-[rgba(0,244,151,1)] via-[rgba(0,243,244,1)] to-[rgba(212,0,244,1)] "
              
            }}
            variant="determinate"
            value={newPost.totalMediaProgress}
          />
        </div>
      )}
      <div className="h-full w-auto aspect-square">
        {newPost.selectedMediaType.slice(0, 5) === "image" &&
          newPost.selectedMediaUrl &&
          newPost.selectedMediaType && (
            <img src={ newPost.selectedMediaUrl} alt="" className="w-full h-full object-cover" />
          )}
        {newPost.selectedMediaType.slice(0, 5) === "video" &&
          newPost.selectedMediaUrl &&
          newPost.selectedMediaType && (
            <video
              controls
              autoPlay
              muted
              loop
              className="w-full h-full object-contain"
            >
              <source src={newPost.selectedMediaUrl} type="video/mp4" />
            </video>
          )}
      </div>
      <Stack>
        <div className="flex gap-2 p-5 justify-start items-center">
          <Avatar src={currentUser.signedUser && currentUser.signedUser.photoURL} alt="" className="w-10 h-10" />
          <h1>{currentUser.signedUser && currentUser.signedUser.displayName}</h1>
        </div>
        <textarea
          placeholder="Write Your Caption"
          value={newPost.inputComment}
          onChange={(e) => {
            if (newPost.inputComment.length <= 200) {
           
              newPost.inputComment = e.target.value
            }

          
          }}
          className="min-w-[20rem] w-full h-1/2 resize-none bg-white dark:bg-stone-950 border-none outline-none px-5 py-0 text-stone-900 dark:text-stone-500"
        />
        <Stack justifyContent={""}>
          <div className="flex gap-2 p-5 justify-between items-center text-stone-600">
            <IconButton
              onClick={() => {
             
                newPost.emojiClicked = !newPost.emojiClicked
              }}
            >
              <SentimentSatisfiedOutlined className="text-stone-600 text-lg cursor-pointer" />
            </IconButton>
            <h1>{newPost.inputComment.length}/200</h1>
          </div>
          {newPost.emojiClicked && (
            <Box sx={{ overflow: "auto", height: "15rem", width: "100%" }}>
              <Picker
                data={data}
                theme={"auto"}
                set={"native"}
                onEmojiSelect={(e) => {
                  
                  newPost.inputComment = newPost.inputComment + e.native
                  newPost.emojiClicked = false


                }}
              />
            </Box>
          )}
        </Stack>
      </Stack>
    </Stack>
  );
};


export default observer(WriteCaption)