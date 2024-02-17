import { Avatar, Stack } from "@mui/material";
import React from "react";

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

export default UserComment;
