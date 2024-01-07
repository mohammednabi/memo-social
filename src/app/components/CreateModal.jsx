"use client";
import Paper from "@mui/material/Paper";
import Dialog from "@mui/material/Dialog";
import React, { useContext, useRef, useState } from "react";
import Divider from "@mui/material/Divider";
import Modal from "@mui/material/Modal";
import Stack from "@mui/material/Stack";
import { PhotoAlbum } from "@mui/icons-material";
import Image from "next/image";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import LinearProgress from "@mui/material/LinearProgress";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import SentimentSatisfiedOutlinedIcon from "@mui/icons-material/SentimentSatisfiedOutlined";
import { UserContext } from "../contexts/user";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { doc, setDoc, addDoc } from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";

import { db, postsCol } from "../firebase/FireBase-config";

import Confetti from "react-confetti-boom";

export default function CreateModal({ open, handleClose }) {
  const user = useContext(UserContext);
  const inputRef = useRef();
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [selectedMediaType, setSelectedMediaType] = useState(null);
  const [selectedMediaObj, setSelectedMediaObj] = useState(null);
  const [inputComment, setInputComment] = useState("");
  const [emojiClicked, setEmojiClicked] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [postUploaded, setPostUploaded] = useState(false);
  // const [imgUploadedPath, setImgUploadedPath] = useState(null);

  // use window size from confetti library

  const onButtonClicked = () => {
    inputRef.current.click();
  };

  const handleInputChanges = (e) => {
    setSelectedMedia(URL.createObjectURL(e.target.files[0]));
    setSelectedMediaType(e.target.files[0].type);
    setSelectedMediaObj(e.target.files[0]);
    console.log("selected media : ", e.target.files);
    console.log("selected media : ", e.target.files[0].type);
  };

  const back = () => {
    setSelectedMedia(null);
  };

  const uploadImage = (image) => {
    if (image === null) return;
    const storage = getStorage();
    const imageRef = ref(storage, `/images/${image.name + uuidv4()}`);
    setIsUploading(true);
    uploadBytes(imageRef, image)
      .then((uploadedImg) => {
        setIsUploading(false);
        // alert("media uploaded successfully!");
        // setImgUploadedPath(uploadedImg.ref._location.path_);
        if (uploadedImg.ref._location.path_ !== null) {
          getDownloadURL(imageRef).then((url) => {
            addPost(user, url, inputComment);
          });
        }
        console.log("this is the uploaded img : ", uploadedImg);
      })
      .catch((error) => {
        setIsUploading(false);
        alert("Failed to upload media", error);
      });
  };

  const addPost = (user, media, caption) => {
    const postDate = new Date();
    addDoc(postsCol, {
      author: {
        id: user.uid,
        name: user.displayName,
        avatar: user.photoURL,
        email: user.email,
      },

      description: caption,
      media: media,
      mediaType: selectedMediaType,

      timestamp: {
        created: {
          time: postDate.getTime(),
          date: postDate.toLocaleDateString(),
        },
        updated: {
          time: postDate.getTime(),
          date: postDate.toLocaleDateString(),
        },
      },
      likes: [],
      comments: [],
    })
      .then(() => {
        setPostUploaded(true);
        // alert("Post added successfully");
      })
      .catch((error) => {
        alert("Failed to add post", error);
        console.log(error);
      });
  };

  const resetAllStates = () => {
    setSelectedMedia(null);
    setSelectedMediaType(null);
    setSelectedMediaObj(null);
    setInputComment("");
    setEmojiClicked(false);
    setIsUploading(false);
    setPostUploaded(false);
    // setImgUploadedPath(null);
  };

  return (
    <Modal
      open={open}
      onClose={() => {
        handleClose();
        resetAllStates();
      }}
      className="
      grid place-items-center border-none outline-none
    "
    >
      <Paper
        className={`bg-stone-950 font-insta capitalize text-white rounded-md flex flex-col  items-center  min-w-[30rem] w-auto`}
      >
        {!postUploaded && (
          <Stack
            direction={"row"}
            justifyContent={`${selectedMedia ? "space-between" : "center"}`}
            alignItems={"center"}
            className="w-full p-5"
          >
            {selectedMedia && !isUploading && (
              <button
                className="text-lg bg-stone-900 px-2 py-1 rounded-md text-red-500 capitalize font-semibold"
                onClick={back}
              >
                back
              </button>
            )}
            {!isUploading ? (
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
            {selectedMedia && !isUploading && (
              <button
                className="text-lg bg-stone-900 px-2 py-1 rounded-md text-blue-500 capitalize font-semibold"
                onClick={(e) => {
                  uploadImage(selectedMediaObj);
                }}
              >
                share{" "}
              </button>
            )}
          </Stack>
        )}
        <Divider variant="middle" className=" border-white/5  w-full" />
        {!selectedMedia && !postUploaded && (
          <Stack className="h-auto min-h-[20rem] justify-center items-center gap-3">
            <img
              src={"/content.png"}
              alt=""
              className="w-28 h-28 invert opacity-5"
            />
            <h1 className="text-2xl">drag your media here</h1>
            <input
              ref={inputRef}
              type="file"
              className="hidden"
              accept="image/*,video/*"
              onChange={(e) => {
                handleInputChanges(e);
              }}
            />
            <button
              className="bg-stone-900 text-white px-5 py-3 capitalize rounded-xl"
              onClick={onButtonClicked}
            >
              select from device
            </button>
          </Stack>
        )}
        {selectedMedia && !postUploaded && (
          <WriteCaption
            media={selectedMedia}
            selectedMediaType={selectedMediaType}
            inputComment={inputComment}
            setInputComment={setInputComment}
            emojiClicked={emojiClicked}
            setEmojiClicked={setEmojiClicked}
            user={user}
            isUploading={isUploading}
          />
        )}
        {postUploaded && <SuccessfulPost />}
      </Paper>
    </Modal>
  );
}

// const UploadMedia = () =>
// {
//   return (

//   )
// }

const WriteCaption = ({
  media,
  inputComment,
  setInputComment,
  emojiClicked,
  setEmojiClicked,
  user,
  isUploading,
  selectedMediaType,
}) => {
  return (
    <Stack direction={"row"} className=" h-[30rem] relative">
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
        {selectedMediaType.slice(0, 5) === "image" &&
          media &&
          selectedMediaType && (
            <img src={media} alt="" className="w-full h-full object-cover" />
          )}
        {selectedMediaType.slice(0, 5) === "video" &&
          media &&
          selectedMediaType && (
            <video
              controls
              autoPlay
              muted
              loop
              className="w-full h-full object-contain"
            >
              <source src={media} type="video/mp4" />
            </video>
          )}
      </div>
      <Stack>
        <div className="flex gap-2 p-5 justify-start items-center">
          <Avatar src={user && user.photoURL} alt="" className="w-10 h-10" />
          <h1>{user && user.displayName}</h1>
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
              <SentimentSatisfiedOutlinedIcon className="text-stone-600 text-lg cursor-pointer" />
            </IconButton>
            <h1>{inputComment.length}/200</h1>
          </div>
          {emojiClicked && (
            <Box sx={{ overflow: "auto", height: "15rem", width: "100%" }}>
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
  );
};

const SuccessfulPost = () => {
  return (
    <Stack className=" h-[25rem] justify-center items-center gap-3 p-3">
      <Confetti
        mode="fall"
        particleCount={100}
        shapeSize={14}
        colors={["#00f497", "#00f3f4", "#d400f4", "#00f5d0"]}

        //  " linear-gradient(45deg, rgba(0,244,151,1) 0%, rgba(0,243,244,1) 57%, rgba(212,0,244,1) 100%)",
      />
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
        your post was shared successfully{" "}
      </h2>
    </Stack>
  );
};
