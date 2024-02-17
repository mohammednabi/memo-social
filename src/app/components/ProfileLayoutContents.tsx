"use client";
import React, { use, useContext, useEffect, useState } from "react";
import Stack from "@mui/material/Stack";
import Avatar from "@mui/material/Avatar";

import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import { Settings } from "@mui/icons-material";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase/Firebase-auth";
import Skeleton from "@mui/material/Skeleton";
// import { UserContext } from "../contexts/user";

import Link from "next/link";
import { StoreContext } from "../contexts/StoreContext";
import { observer } from "mobx-react-lite";

const ProfileLayoutContents = () => {
  // const user = useContext(UserContext);


  const { posts,currentUser } = useContext(StoreContext);

  return (
    <Grid2
      container
      justifyContent={"center"}
      alignItems={"center"}
      sx={{
        height: "40vh",
      }}
    >
      <Grid2
        xs={3.5}
        container
        justifyContent={"flex-end"}
        alignItems={"center"}
      >
        {currentUser.signedUser.uid !=="" ? (
          <Avatar src={currentUser.signedUser.photoURL} className="w-36 h-36" />
        ) : (
          <Skeleton variant="circular" className="skeleton">
            <Avatar src="" className="w-36 h-36" />
          </Skeleton>
        )}
      </Grid2>
      <Grid2
        xs={8.5}
        container
        justifyContent={"flex-start"}
        alignItems={"center"}
        className="px-20"
      >
        <Stack spacing={3}>
          <Stack
            direction={"row"}
            spacing={4}
            alignItems={"center"}
            className="font-insta"
          >
            {currentUser.signedUser.uid !=="" ? (
              <h1 className="text-white text-xl font-insta ">
                {currentUser.signedUser.displayName ? currentUser.signedUser.displayName : "unknown"}
              </h1>
            ) : (
              <Skeleton variant="rounded" className="skeleton">
                <h1 className="text-white text-xl ">mo_nebo</h1>
              </Skeleton>
            )}
            <Stack direction={"row"} spacing={1} alignItems={"center"}>
              <Link
                href={"/userdata"}
                className="capitalize text-white bg-stone-800 transition-colors hover:bg-stone-900 p-3 py-2 rounded-xl"
              >
                edit profile
              </Link>
              <button className="capitalize text-white bg-stone-800 transition-colors hover:bg-stone-900 p-3 py-2 rounded-xl">
                view archive
              </button>
              <Settings sx={{ color: "white", fontSize: "2rem" }} />
            </Stack>
          </Stack>
          <Stack direction={"row"} spacing={4} alignItems={"center"}>
            {currentUser.signedUser.uid !=="" ? (
              <h1 className="text-white ">{posts.userPostsLength} posts</h1>
            ) : (
              <Skeleton variant="rounded" className="skeleton">
                <h1 className="text-white font-insta ">200 posts</h1>
              </Skeleton>
            )}
            {currentUser.signedUser.uid !=="" ? (
              <h1 className="text-white ">{currentUser.signedUser.data.followers.length} followers</h1>
            ) : (
              <Skeleton variant="rounded" className="skeleton">
                <h1 className="text-white font-insta ">200 followers</h1>
              </Skeleton>
            )}
            {currentUser.signedUser.uid !=="" ? (
              <h1 className="text-white ">{currentUser.signedUser.data.following.length} following</h1>
            ) : (
              <Skeleton variant="rounded" className="skeleton">
                <h1 className="text-white font-insta ">200 following</h1>
              </Skeleton>
            )}
          </Stack>
          <Stack spacing={1} justifyContent={"center"}>
            {currentUser.signedUser.uid !=="" ? (
              <h1 className="text-white font-insta text-lg">
                @{currentUser.signedUser.data.username}
              </h1>
            ) : (
              <Skeleton variant="rounded" className="skeleton">
                <h1 className="text-white font-insta ">
                  Mohammed Nabil@demo.com
                </h1>
              </Skeleton>
            )}
            <Stack direction={"row"} spacing={4} alignItems={"center"}>
              {currentUser.signedUser.uid !=="" ? (
                <h1 className="text-white font-insta "> {currentUser.signedUser.data.bio}</h1>
              ) : (
                <Skeleton variant="rounded" className="skeleton">
                  <h1 className="text-white font-insta "> description</h1>
                </Skeleton>
              )}
            </Stack>
            {currentUser.signedUser.uid !=="" ? (
              <Link
                href={currentUser.signedUser.data.link}
                target="_blank"
                className="text-blue-400 transition-colors hover:text-blue-500"
              >
                {currentUser.signedUser.data.link}
              </Link>
            ) : (
              <Skeleton variant="rounded" className="skeleton">
                <h1 className="text-white font-insta "> description</h1>
              </Skeleton>
            )}
          </Stack>
        </Stack>
      </Grid2>
    </Grid2>
  );
};

export default observer(ProfileLayoutContents);
