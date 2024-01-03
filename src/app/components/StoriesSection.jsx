import { Avatar, Stack } from "@mui/material";
import React from "react";

export default function StoriesSection() {
  return (
    <section className="mt-8  w-10/12 flex gap-5 h-16  max-w-full overflow-auto ">
      <Story />
      <Story />
      <Story />
      <Story />
      <Story />
      <Story />
      <Story />
      <Story />
      <Story />
      <Story />
      <Story />
      <Story />
      <Story />
      <Story />
      <Story />
      <Story />
      <Story />
      <Story />
      <Story />
      <Story />
    </section>
  );
}

const Story = () => {
  return (
    <div
      className="w-16 aspect-square rounded-full bg-white flex justify-center items-center cursor-pointer"
      style={{
        background:
          " linear-gradient(45deg, rgba(0,244,151,1) 0%, rgba(0,243,244,1) 57%, rgba(212,0,244,1) 100%)",
      }}
    >
      <Avatar
        className="  w-14 h-14  border-2 border-black border-solid"
        src="/me in suit profile image after edit.jpg"
      />
    </div>
  );
};
