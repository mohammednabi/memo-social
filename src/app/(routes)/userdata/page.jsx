"use client";
import { UserContext } from "@/app/contexts/user";
import { user } from "@/app/firebase/Firebase-auth";
import {
  addUser,
  editUserProfile,
  updateUserImage,
  uploadAvatarImage,
} from "@/app/functions/updateDocument";
import { Camera, Check, Delete } from "@mui/icons-material";
import ImageIcon from "@mui/icons-material/Image";
import {
  Alert,
  Avatar,
  CircularProgress,
  IconButton,
  LinearProgress,
  Modal,
  Paper,
  Stack,
} from "@mui/material";
import { getDownloadURL, getStorage, ref } from "firebase/storage";
import React, { useContext, useEffect, useRef, useState } from "react";

export default function UserDataPage() {
  const [links, setLinks] = useState([]);
  const user = useContext(UserContext);
  const [userData, setUserData] = useState({
    displayName: user ? user.displayName : "",
    uid: user ? user.uid : "",
    userName: user ? user.userName : "",
    bio: user ? user.bio : "",
    photoURL: user ? user.photoURL : "",
    // links: user ? user.links : links,
    link: user ? user.link : "",
    followers: user ? user.followers : [],
    following: user ? user.following : [],
  });

  const [isloading, setIsLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const saveButtonRef = useRef();

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const saveChanges = () => {
    setIsLoading(true);
    setDone(false);
    editUserProfile(userData.displayName, userData.photoURL)
      .then(() => {
        addUser(user.uid, userData).then(() => {
          setIsLoading(false);
          setDone(true);
        });
      })
      .catch((err) => {
        setIsLoading(false);
        console.log(err);
      });
  };

  useEffect(() => {
    setUserData({
      displayName: user ? user.displayName : "",
      uid: user ? user.uid : "",
      userName: user ? user.userName : "",
      bio: user ? user.bio : "",
      photoURL: user ? user.photoURL : "",
      // links: user ? user.links : links,
      link: user ? user.link : "",
      followers: user ? user.followers : [],
      following: user ? user.following : [],
    });
  }, [user]);

  useEffect(() => {
    if (done) {
      setTimeout(() => {
        setDone(false);
      }, 6000);
    }
  }, [done]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        saveButtonRef.current.dispatchEvent(
          new MouseEvent("click", { bubbles: true })
        );
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <Stack spacing={2} className="w-full h-auto  text-white py-5 px-10">
      <AvatarModal
        open={openModal}
        close={handleCloseModal}
        user={user}
        userData={userData}
      />
      <Stack
        direction={"row"}
        spacing={1}
        className="items-center justify-between pb-10"
      >
        <h1 className="text-3xl capitalize">edit profile</h1>
        <Stack className="relative flex justify-center items-center">
          <IconButton
            onClick={handleOpenModal}
            className="w-16 h-16 opacity-30  absolute z-10 bg-black "
          >
            <Camera className="text-white text-xl" />
          </IconButton>
          <Avatar src={userData.photoURL} className="w-16 h-16" />
        </Stack>
      </Stack>

      <div className="grid gap-5 grid-cols-2 w-full">
        <Stack spacing={1}>
          <label className="capitalize text-xl font-mono">display name </label>
          <input
            value={userData.displayName}
            onChange={(e) => {
              setUserData({ ...userData, displayName: e.target.value });
            }}
            className="text-white bg-stone-900 px-2  border-white outline-none w-full h-12"
          />
        </Stack>
        <Stack spacing={1}>
          <label className="capitalize text-xl font-mono">username </label>
          <input
            value={userData.userName}
            onChange={(e) => {
              setUserData({ ...userData, userName: e.target.value });
            }}
            className="text-white bg-stone-900 px-2  border-white outline-none w-full h-12"
          />
        </Stack>
      </div>
      <Stack spacing={1}>
        <label className="capitalize text-xl font-mono">bio </label>
        <textarea
          value={userData.bio}
          onChange={(e) => {
            setUserData({ ...userData, bio: e.target.value });
          }}
          className="text-white bg-stone-900 px-2 py-2  border-white outline-none w-full h-20 resize-none"
        />
      </Stack>

      <Stack spacing={1}>
        <label className="capitalize text-xl font-mono">link</label>

        <input
          value={userData.link}
          onChange={(e) => {
            setUserData({ ...userData, link: e.target.value });
          }}
          className="text-white bg-stone-900 px-2  border-white outline-none w-full h-12"
        />
      </Stack>

      <div className="flex justify-center  items-center gap-2  bg-blue-600 text-white px-5 py-2 transition-colors hover:bg-blue-400 capitalize text-lg">
        {!isloading ? (
          <button
            ref={saveButtonRef}
            onClick={saveChanges}
            className="capitalize w-full"
          >
            save changes
          </button>
        ) : (
          <CircularProgress color="inherit" size={30} />
        )}
      </div>
      {done && (
        <Alert
          icon={<Check fontSize="inherit" className="text-white" />}
          severity="success"
          className={`bg-green-600 text-white `}
        >
          your data was updated successfully .
        </Alert>
      )}
    </Stack>
  );
}

const AvatarModal = ({ open, close, user, userData }) => {
  const [imgUrl, setImgUrl] = useState(null);
  const [imgObj, setImgObj] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const inputRef = useRef();
  const viewImage = (e) => {
    const inputFile = inputRef.current.files[0];
    const imgSrc = URL.createObjectURL(inputFile);
    setImgUrl(imgSrc);
    setImgObj(inputFile);
  };

  return (
    <Modal
      open={open}
      onClose={() => {
        if (!isUploading) {
          setImgUrl("");
          close();
        }
      }}
      className="
      grid place-items-center border-none outline-none
    "
    >
      <Paper
        className={`bg-stone-950 font-insta capitalize  text-white rounded-md flex flex-col  items-center   w-auto`}
      >
        <Stack className="items-center relative">
          {isUploading && (
            <div className="absolute top-0 left-0  w-full h-full bg-black/50">
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

          <label htmlFor="img-input" className="cursor-pointer">
            <input
              ref={inputRef}
              id="img-input"
              type="file"
              accept="image/*"
              hidden
              onChange={(e) => {
                viewImage(e);
              }}
            />
            <div
              onDragOver={(e) => {
                e.preventDefault();
                console.log("this is the event from drag :", e);
              }}
              onDrop={(e) => {
                e.preventDefault();
                inputRef.current.files = e.dataTransfer.files;
                viewImage();
                // console.log("this is the event from drop :", e);
              }}
              onClick={(e) => {
                console.log("this is th eevent : ", e);
              }}
              className="w-96 h-96 border-white/20 border-dashed border-[1px]"
            >
              {imgUrl ? (
                <img
                  loading="lazy"
                  src={imgUrl}
                  alt="avatar preview"
                  className="w-full h-full object-cover object-center"
                />
              ) : (
                <div className="w-full flex flex-col gap-3 h-full justify-center items-center">
                  <ImageIcon className="text-white/50 text-9xl" />
                  <h1 className="text-white/20 text-2xl w-3/4 text-center">
                    drag and drop or select your image
                  </h1>
                </div>
              )}
            </div>
          </label>
          {!isUploading && (
            <div className="bg-stone-950 flex justify-center py-3 items-center w-full ">
              <button
                className="bg-stone-950 transition-colors hover:bg-stone-900  capitalize w-full text-xl "
                style={{
                  background:
                    " linear-gradient(45deg, rgba(0,244,151,1) 0%, rgba(0,243,244,1) 57%, rgba(212,0,244,1) 100%)",
                  backgroundClip: "text",
                  color: "transparent",
                }}
                onClick={() => {
                  if (imgObj) {
                    const storage = getStorage();

                    setIsUploading(true);
                    uploadAvatarImage(imgObj).then((img) => {
                      const imgRef = ref(storage, `${img.ref._location.path_}`);

                      if (img.ref._location.path_ !== null) {
                        getDownloadURL(imgRef).then((url) => {
                          updateUserImage(user.uid, url, userData).then(() => {
                            setIsUploading(false);
                            close();
                          });
                        });
                      }
                    });
                  }
                }}
              >
                save
              </button>
            </div>
          )}
        </Stack>
      </Paper>
    </Modal>
  );
};
