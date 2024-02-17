import { Stack } from "@mui/material";
import React from "react";

const SuccessfulUpdatedPost = () => {
  return (
    <Stack className=" h-[25rem] justify-center capitalize items-center gap-3 p-3 px-10">
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
        your post was updated successfully{" "}
      </h2>
    </Stack>
  );
};

export default SuccessfulUpdatedPost;
