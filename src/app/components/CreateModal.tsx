"use client";
import Paper from "@mui/material/Paper";

import React, { useContext, useRef, useState } from "react";
import Divider from "@mui/material/Divider";
import Modal from "@mui/material/Modal";
import Stack from "@mui/material/Stack";
import { StoreContext } from "../contexts/StoreContext";
import { observer } from "mobx-react-lite";
import WriteCaption from "./createModalComponents/WriteCaption";
import SuccessfulPost from "./createModalComponents/SuccessfulPost";

 const  CreateModal=({ open, handleClose })=> {

  const inputRef = useRef<HTMLInputElement|null>(null);
 

  // use window size from confetti library

   const { currentUser, newPost } = useContext(StoreContext)
 



  const onButtonClicked = () => {
    inputRef.current.click();
  };

  const handleInputChanges = () => {
   
    console.log("selected media obj : ", inputRef.current.files);
    console.log("selected media type : ", inputRef.current.files[0].type);
    console.log("selected media : ", URL.createObjectURL(inputRef.current.files[0]));
    console.log("selected media : ", typeof URL.createObjectURL(inputRef.current.files[0]));

    newPost.selectedMediaUrl = URL.createObjectURL(inputRef.current.files[0])
    newPost.selectedMediaType = inputRef.current.files[0].type
    newPost.selectedMediaObj = inputRef.current.files[0]
  };

 

 

  



  return (
    <Modal
      open={open}
      onClose={() => {
        handleClose();
        
        newPost.resetAllStates()
      }}
      className="
      grid place-items-center border-none outline-none
    "
    >
      <Paper
        className={`bg-white dark:bg-stone-950 font-insta capitalize text-stone-950 dark:text-white rounded-md flex flex-col  items-center  min-w-[30rem] w-auto`}
      >
        {!newPost.isPostUploaded && (
          <Stack
            direction={"row"}
            justifyContent={`${newPost.selectedMediaUrl ? "space-between" : "center"}`}
            alignItems={"center"}
            className="w-full p-5"
          >
            {newPost.selectedMediaUrl && !newPost.isUploading && (
              <button
                className="text-lg bg-stone-100 dark:bg-stone-900 px-2 py-1 rounded-md text-red-500 capitalize font-semibold"
                onClick={newPost.back}
              >
                back
              </button>
            )}
            {!newPost.isUploading ? (
              <h1 className="text-xl text-center">create new post </h1>
            ) : (
              <h1
                className="text-2xl text-center "
                style={{
                  background:
                    " linear-gradient(45deg, rgba(0,244,151,1) 0%, rgba(0,243,244,1) 57%, rgba(212,0,244,1) 100%)",
                  backgroundClip: "text",
                  color: "transparent",
                }}
              >
                creating your post{" "}
              </h1>
            )}
            {newPost.selectedMediaUrl && !newPost.isUploading && (
              <button
                className="text-lg bg-stone-100 dark:bg-stone-900 px-2 py-1 rounded-md text-blue-500 capitalize font-semibold"
                onClick={(e) => {
                 

                  newPost.uploadTheWholePost(
                   
                    currentUser.signedUser,
          
             
              )
                }}
              >
                share{" "}
              </button>
            )}
          </Stack>
        )}
        <Divider
          variant="middle"
          className=" border-stone-950/10 dark:border-white/5  w-full"
        />
        {!newPost.selectedMediaUrl && !newPost.isPostUploaded && (
          <div
            onDragOver={(e) => {
              e.preventDefault();
            }}
            onDrop={(e) => {
              e.preventDefault();
              inputRef.current.files = e.dataTransfer.files;
              handleInputChanges();
            }}
            className="flex flex-col border-dashed border-stone-950/10 dark:border-white/5 border-2 w-full h-auto min-h-[20rem] justify-center items-center gap-3"
          >
            <img
              src={"/content.png"}
              alt=""
              className="w-28 h-28 dark:invert opacity-10 dark:opacity-5"
            />
            <h1 className="text-2xl">drag your media here</h1>
            <input
              ref={inputRef}
              type="file"
              className="hidden"
              accept="image/*,video/*"
              onChange={() => {
                handleInputChanges();
              }}
            />
            <button
              className="bg-stone-100 text-stone-950 dark:bg-stone-900 dark:text-white px-5 py-3 capitalize rounded-xl"
              onClick={onButtonClicked}
            >
              select from device
            </button>
          </div>
        )}
        {newPost.selectedMediaUrl && !newPost.isPostUploaded && (
          <WriteCaption
          />
        )}
        {newPost.isPostUploaded && <SuccessfulPost />}
      </Paper>
    </Modal>
  );
}





export default observer(CreateModal)