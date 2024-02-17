"use client";
import { Avatar, Stack } from "@mui/material";
import React, { useContext } from "react";
import { StoreContext } from "../contexts/StoreContext";
import { observer } from "mobx-react-lite";
import Suggested from "./Suggested";
// import { UserContext } from "../contexts/user";

const SuggestedFriendsSection =()=> {
  // const user = useContext(UserContext);

const {currentUser} = useContext(StoreContext)
  return (
    <section className="flex flex-col gap-5 mt-14">
      <Suggested
        image={currentUser.signedUser.photoURL}
        name={currentUser.signedUser.displayName}
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
        image={currentUser.signedUser.photoURL}
        name={currentUser.signedUser.displayName}
      /> <Suggested
        image={currentUser.signedUser.photoURL}
        name={currentUser.signedUser.displayName}
      /> <Suggested
        image={currentUser.signedUser.photoURL}
        name={currentUser.signedUser.displayName}
      /> <Suggested
        image={currentUser.signedUser.photoURL}
        name={currentUser.signedUser.displayName}
      /> <Suggested
        image={currentUser.signedUser.photoURL}
        name={currentUser.signedUser.displayName}
      />
    </section>
  );
}

export default observer(SuggestedFriendsSection)

