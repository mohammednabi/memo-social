import { Avatar, Stack } from "@mui/material";
import React from "react";

const AuthorDescription = ({ name, avatar, content }) => {
  return (
    <Stack spacing={0.5}>
      <Stack direction={"row"} spacing={2} className="items-center">
        <Avatar src={avatar} className="w-10 h-10" />
        <h1>{name}</h1>

        <h2 className="text-white/50 text-xs">(author)</h2>
      </Stack>
      <h3 className="pl-14 text-sm  text-white w-full">{content}</h3>
    </Stack>
  );
};

export default AuthorDescription;
