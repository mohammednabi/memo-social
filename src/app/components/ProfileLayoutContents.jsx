"use client";
import React, { use, useContext, useEffect, useState } from "react";
import Stack from "@mui/material/Stack";
import Avatar from "@mui/material/Avatar";

import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import { Settings } from "@mui/icons-material";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase/Firebase-auth";
import Skeleton from "@mui/material/Skeleton";
import { UserContext } from "../contexts/user";
import usePosts from "../hooks/usePosts";

export default function ProfileLayoutContents() {
  const user = useContext(UserContext);
  const posts = usePosts();
  const [userPostsLength, setUserPostsLength] = useState(0);

  const getUserPosts = () => {
    if (user && posts) {
      const allUserPosts = posts.filter((post) => {
        return post.author.id === user.uid;
      });

      setUserPostsLength(allUserPosts.length);
    }
  };

  useEffect(() => {
    getUserPosts();
  }, [user, posts]);

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
        {user ? (
          <Avatar src={user.photoURL} className="w-36 h-36" />
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
            {user ? (
              <h1 className="text-white text-xl font-insta ">
                {user.displayName ? user.displayName : "unknown"}
              </h1>
            ) : (
              <Skeleton variant="rounded" className="skeleton">
                <h1 className="text-white text-xl ">mo_nebo</h1>
              </Skeleton>
            )}
            <Stack direction={"row"} spacing={1} alignItems={"center"}>
              <button className="capitalize text-white bg-stone-800 transition-colors hover:bg-stone-900 p-3 py-2 rounded-xl">
                edit profile
              </button>
              <button className="capitalize text-white bg-stone-800 transition-colors hover:bg-stone-900 p-3 py-2 rounded-xl">
                view archive
              </button>
              <Settings sx={{ color: "white", fontSize: "2rem" }} />
            </Stack>
          </Stack>
          <Stack direction={"row"} spacing={4} alignItems={"center"}>
            <h1 className="text-white ">{userPostsLength} posts</h1>
            <h1 className="text-white ">76 followers</h1>
            <h1 className="text-white ">167 following</h1>
          </Stack>
          <Stack spacing={1} justifyContent={"center"}>
            {user ? (
              <h1 className="text-white font-insta ">{user.email}</h1>
            ) : (
              <Skeleton variant="rounded" className="skeleton">
                <h1 className="text-white font-insta ">
                  Mohammed Nabil@demo.com
                </h1>
              </Skeleton>
            )}
            <Stack direction={"row"} spacing={4} alignItems={"center"}>
              <h1 className="text-white font-insta "> description</h1>
            </Stack>
          </Stack>
        </Stack>
      </Grid2>
    </Grid2>
  );
}
