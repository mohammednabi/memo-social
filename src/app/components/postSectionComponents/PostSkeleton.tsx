"use client"
import { BookmarkBorderOutlined, ChatBubbleOutlineOutlined, FavoriteBorderOutlined, SendOutlined } from "@mui/icons-material";
import { Avatar, Skeleton, Stack } from "@mui/material";
import React from "react";


const PostSkeleton = () => {
  return (
    <Stack spacing={2} className="font-insta mb-10">
      <Stack direction={"row"} className="     items-center" spacing={1}>
        <Skeleton variant="circular" className="skeleton">
          <Avatar src="" />
        </Skeleton>
        <Skeleton variant="rounded" className="skeleton">
          <h1 className="text-white font-semibold">mohammed nabil</h1>
        </Skeleton>
        <Skeleton variant="rounded" className="skeleton">
          <Stack direction={"row"}>
            <h2 className="text-white/25">.</h2>
            <h3 className="text-white/25"> 5 m</h3>
          </Stack>
        </Skeleton>
      </Stack>
      <Skeleton variant="rectangular" className="skeleton">
        <div className="w-112 aspect-square">
          <img
            className="w-full h-full object-cover rounded-md"
            alt=""
            src=""
            loading="lazy"
          />
        </div>
      </Skeleton>

      <Skeleton variant="rounded" className="skeleton">
        <Stack
          direction={"row"}
          className="text-white justify-between items-center"
        >
          <Stack
            direction={"row"}
            spacing={2}
            className="justify-center items-center"
          >
            <FavoriteBorderOutlined sx={{ fontSize: "2rem", color: "red" }} />
            <ChatBubbleOutlineOutlined sx={{ fontSize: "2rem" }} />
            <SendOutlined
              sx={{ fontSize: "2rem" }}
              className="-rotate-12"
            />
          </Stack>

          <BookmarkBorderOutlined sx={{ fontSize: "2rem" }} />
        </Stack>
      </Skeleton>
  
    </Stack>
  );
};


export default PostSkeleton