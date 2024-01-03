"use client";
import { Avatar, Stack } from "@mui/material";
import React, { useContext } from "react";
import { UserContext } from "../contexts/user";

export default function SuggestedFriendsSection() {
  const user = useContext(UserContext);
  return (
    <section className="flex flex-col gap-5 mt-14">
      <Suggested
        image={user && user.photoURL}
        name={user && user.displayName}
      />
      <Stack direction={"row"} alignItems={"center"} spacing={9}>
        <h1 className="text-stone-950/50 dark:text-white/50 text-sm">
          Suggested for you{" "}
        </h1>
        <button className="text-stone-950 dark:text-white hover:text-stone-950/50 dark:hover:text-white/50 text-xs capitalize">
          see all
        </button>
      </Stack>
      <Suggested
        image={user && user.photoURL}
        name={user && user.displayName}
      />{" "}
      <Suggested
        image={user && user.photoURL}
        name={user && user.displayName}
      />{" "}
      <Suggested
        image={user && user.photoURL}
        name={user && user.displayName}
      />{" "}
      <Suggested
        image={user && user.photoURL}
        name={user && user.displayName}
      />{" "}
      <Suggested
        image={user && user.photoURL}
        name={user && user.displayName}
      />
    </section>
  );
}

const Suggested = ({ image, name }) => {
  return (
    <Stack direction={"row"} spacing={2} alignItems={"center"}>
      <Avatar alt="" src={image} className="w-12 h-12" />
      <Stack spacing={0}>
        <h1 className="text-stone-950 dark:text-white font-bold text-sm">
          {name}
        </h1>
        <h2 className="text-stone-950 dark:text-white/70 text-xs">
          Suggested for you
        </h2>
      </Stack>
      <button className="text-blue-600 hover:text-stone-950 dark:hover:text-white text-xs">
        Follow
      </button>
    </Stack>
  );
};
