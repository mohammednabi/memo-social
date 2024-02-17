"use client";
import { DarkMode, LightMode, Logout, Settings } from "@mui/icons-material";
import { CircularProgress, Switch } from "@mui/material";
import React, { useState } from "react";
import { signOut } from "firebase/auth";
import { auth } from "../firebase/Firebase-auth";

export default function MoreMenu() {
  const [checked, setChecked] = useState(true);
  const [loading, setLoading] = useState(true);

  const logout = (auth) => {
    signOut(auth);
    setLoading(true);
  };

  return (
    <div className="absolute top-[78vh] left-0 w-full  h-screen capitalize ">
      <div className="absolute -top-full flex flex-col-reverse gap-2 left-0 h-auto w-full rounded-md bg-stone-950 p-2">
        <div
          onClick={() => {
            logout(auth);
          }}
          className="cursor-pointer flex items-center gap-2 hover:bg-stone-900 p-2 rounded-md"
        >
          {loading && <LoadingCircle />}
          <Logout />
          <h1>log out</h1>
        </div>
        <div className="cursor-pointer flex items-center gap-2 hover:bg-stone-900 p-2 rounded-md">
          {checked ? <DarkMode /> : <LightMode />}
          <h1> dark mode</h1>
          <Switch
            color="secondary"
            checked={checked}
            onChange={(e) => {
              setChecked(e.target.checked);
            }}
          />
        </div>
        <div className="cursor-pointer flex items-center gap-2 hover:bg-stone-900 p-2 rounded-md">
          <Settings />
          <h1>settings</h1>
        </div>
      </div>
    </div>
  );
}

const LoadingCircle = () => {
  return (
    <div className="absolute top-0 left-0 w-screen h-screen flex justify-center items-center bg-white">
      <CircularProgress color="secondary" size={100} />
    </div>
  );
};
