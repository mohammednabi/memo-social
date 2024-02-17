import { Avatar, Stack } from "@mui/material";
import React from "react";

interface iprops{
    image: string
    name:string
}

const Suggested = ({ image, name }:iprops) => {
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


export default Suggested