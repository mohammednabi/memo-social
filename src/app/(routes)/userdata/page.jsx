"use client";
import { Delete } from "@mui/icons-material";
import { Avatar, IconButton, Stack } from "@mui/material";
import React, { useState } from "react";

export default function UserDataPage() {
  const [links, setLinks] = useState([]);

  const addLink = () => {
    const newLink = "";
    const allLinks = [...links, newLink];

    setLinks(allLinks);
  };

  const deleteLink = () => {
    return;
  };

  return (
    <Stack spacing={2} className="w-full h-auto  text-white py-5 px-10">
      <Stack
        direction={"row"}
        spacing={1}
        className="items-center justify-between pb-10"
      >
        <h1 className="text-3xl capitalize">edit profile</h1>
        <Avatar src="" className="w-16 h-16" />
      </Stack>
      <div className="grid gap-5 grid-cols-2 w-full">
        <Stack spacing={1}>
          <label className="capitalize text-xl font-mono">display name </label>
          <input className="text-white bg-stone-900 px-2  border-white outline-none w-full h-12" />
        </Stack>
        <Stack spacing={1}>
          <label className="capitalize text-xl font-mono">username </label>
          <input className="text-white bg-stone-900 px-2  border-white outline-none w-full h-12" />
        </Stack>
      </div>
      <Stack spacing={1}>
        <label className="capitalize text-xl font-mono">bio </label>
        <textarea className="text-white bg-stone-900 px-2 py-2  border-white outline-none w-full h-20 resize-none" />
      </Stack>
      {links.map((link, index) => (
        <Stack key={index} spacing={1}>
          <label className="capitalize text-xl font-mono">
            link {index + 1}{" "}
          </label>
          <Stack direction={"row"} spacing={1}>
            <input className="text-white bg-stone-900 px-2  border-white outline-none w-full h-12" />
            <IconButton onClick={deleteLink}>
              <Delete className="text-red-500 transition-colors hover:text-red-700" />
            </IconButton>
          </Stack>
        </Stack>
      ))}
      <button
        className="text-blue-600 transition-colors hover:text-blue-400 capitalize text-lg"
        onClick={addLink}
      >
        add link +
      </button>
    </Stack>
  );
}
