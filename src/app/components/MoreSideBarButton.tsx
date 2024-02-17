"use client";

import {
  DarkMode,
  LightMode,
  List,
  Logout,
  Settings,
} from "@mui/icons-material";
import React, { useEffect, useRef, useState } from "react";
import MoreMenu from "./MoreMenu";
import Paper from "@mui/material/Paper";
import MenuList from "@mui/material/MenuList";
import MenuItem from "@mui/material/MenuItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemIcon from "@mui/material/ListItemIcon";
import Switch from "@mui/material/Switch";
import { auth } from "../firebase/Firebase-auth";
import { signOut } from "firebase/auth";
import { CircularProgress } from "@mui/material";

export default function MoreSideBarButton() {
  const [showMenu, setShowMenu] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [loading, setLoading] = useState(false);
  const menuRef = useRef();
  const logout = () => {
    signOut(auth);
    setLoading(true);
  };

  //   useEffect(() => {
  //     window.addEventListener("click", (e) => {
  //       if (e.target !== menuRef.current && e.target !== menuItemsRef.current) {
  //         setShowMenu(false);
  //         console.log(menuItemsRef.current);
  //       }
  //     });
  //   }, [showMenu]);

  useEffect(() => {
    const parent = document.getElementById("big-parent");
    isDarkMode ? parent.classList.add("dark") : parent.classList.remove("dark");
  }, [isDarkMode]);

  return (
    <div className="relative">
      {/* {showMenu && <MoreMenu />} */}
      {showMenu && (
        <MoreMenuItems
          isDarkMode={isDarkMode}
          change={setIsDarkMode}
          logout={logout}
          loading={loading}
        />
      )}

      <div
        ref={menuRef}
        className=" flex gap-3 capitalize justify-start items-center font-robooooto transition-colors hover:bg-stone-200 dark:hover:bg-stone-950 p-2 cursor-pointer rounded-xl"
        onClick={() => {
          setShowMenu(!showMenu);
        }}
      >
        {" "}
        <List sx={{ fontSize: "2rem" }} />
        <h1 className="text-lg font-insta">more</h1>
      </div>
    </div>
  );
}

const MoreMenuItems = ({ isDarkMode, change, logout, loading }) => {
  return (
    <Paper className="w-full bg-stone-50 dark:bg-stone-950 text-stone-950 dark:text-white absolute bottom-12">
      <MenuList>
        <MenuItem>
          <ListItemIcon className="text-stone-950 dark:text-white">
            <Settings />
          </ListItemIcon>
          <ListItemText> settings</ListItemText>
        </MenuItem>
        <MenuItem>
          <ListItemIcon className="text-stone-950 dark:text-white">
            {isDarkMode ? <DarkMode /> : <LightMode />}
          </ListItemIcon>
          <ListItemText> dark Mode</ListItemText>
          <Switch
            color="secondary"
            checked={isDarkMode}
            onChange={(e) => {
              change(e.target.checked);
            }}
          />
        </MenuItem>
        <MenuItem onClick={logout}>
          <ListItemIcon className="text-stone-950 dark:text-white">
            <Logout />
          </ListItemIcon>
          <ListItemText> log out</ListItemText>
          {loading && <CircularProgress color="secondary" size={24} />}
        </MenuItem>
      </MenuList>
    </Paper>
  );
};
