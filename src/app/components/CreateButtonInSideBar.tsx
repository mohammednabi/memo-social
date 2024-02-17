"use client";
import Stack from "@mui/material/Stack";
import React, { useState } from "react";
import AddBoxOutlinedIcon from "@mui/icons-material/AddBoxOutlined";
import CreateModal from "./CreateModal";

export default function CreateButtonInSideBar() {
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <div
        className="flex gap-4 capitalize justify-start items-center font-robooooto transition-colors hover:bg-stone-200 dark:hover:bg-stone-950 p-2 cursor-pointer rounded-xl"
        onClick={handleOpen}
      >
        <AddBoxOutlinedIcon sx={{ fontSize: "2rem" }} />
        <h1 className="text-lg font-insta">create</h1>
      </div>
      <CreateModal open={open} handleClose={handleClose} />
    </>
  );
}
