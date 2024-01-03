import React, { useContext } from "react";
import HomeIcon from "@mui/icons-material/Home";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import ExploreOutlinedIcon from "@mui/icons-material/ExploreOutlined";
import MovieOutlinedIcon from "@mui/icons-material/MovieOutlined";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import MapsUgcOutlinedIcon from "@mui/icons-material/MapsUgcOutlined";
import AddBoxOutlinedIcon from "@mui/icons-material/AddBoxOutlined";
import { Avatar, Skeleton, Stack, Switch } from "@mui/material";
import {
  DarkMode,
  LightMode,
  List,
  Logout,
  Mode,
  Search,
  Settings,
} from "@mui/icons-material";
import Link from "next/link";
import { UserContext } from "../contexts/user";

import MoreMenu from "./MoreMenu";
import MoreSideBarButton from "./MoreSideBarButton";

import CreateButtonInSideBar from "./CreateButtonInSideBar";

export default function SideBar() {
  const user = useContext(UserContext);

  const items = [
    { title: "home", icon: <HomeOutlinedIcon sx={{ fontSize: "2rem" }} /> },
    {
      title: "search",
      icon: <Search sx={{ fontSize: "2rem" }} />,
      link: "/search",
    },
    {
      title: "explore",
      icon: <ExploreOutlinedIcon sx={{ fontSize: "2rem" }} />,
      link: "/explore",
    },
    { title: "reels", icon: <MovieOutlinedIcon sx={{ fontSize: "2rem" }} /> },
    {
      title: "messages",
      icon: <MapsUgcOutlinedIcon sx={{ fontSize: "2rem" }} />,
    },
    {
      title: "notifications",
      icon: <FavoriteBorderOutlinedIcon sx={{ fontSize: "2rem" }} />,
    },
    {
      title: "create",
      icon: <AddBoxOutlinedIcon sx={{ fontSize: "2rem" }} />,
    },

    {
      title: "profile",
      icon: user ? (
        <Avatar src={user.photoURL} />
      ) : (
        <Skeleton variant="circular" className="skeleton">
          <Avatar src="" />
        </Skeleton>
      ),
      link: "/profile/posts",
    },
  ];

  return (
    <nav className="sticky top-0 left-0 h-screen w-auto flex flex-col justify-between gap-5 text-stone-950 dark:text-white p-5 border-r-2 border-stone-950/5 dark:border-white/5 border-solid">
      <div className="flex gap-2 items-end">
        <h1
          className="text-3xl font-insta capitalize  "
          style={{
            // background:
            //   " linear-gradient(45deg, rgba(244,187,0,1) 0%, rgba(249,39,70,1) 50%, rgba(177,0,165,1) 100%)",
            background:
              " linear-gradient(45deg, rgba(0,244,151,1) 0%, rgba(0,243,244,1) 57%, rgba(212,0,244,1) 100%)",
            backgroundClip: "text",
            color: "transparent",
          }}
        >
          memo
        </h1>
        <h2 className="text-xs">Social</h2>
      </div>
      <div className=" flex flex-col gap-2">
        {items.map((item) =>
          item.title !== "create" ? (
            <Link key={item.title} href={item.link ? item.link : "/"}>
              <Stack
                direction={"row"}
                spacing={2}
                className="capitalize justify-start items-center font-robooooto transition-colors hover:bg-stone-200 dark:hover:bg-stone-950 p-2 cursor-pointer rounded-xl"
              >
                {item.icon}
                <h1 className="text-lg font-insta">{item.title}</h1>
              </Stack>
            </Link>
          ) : (
            <CreateButtonInSideBar key={"create"} />
          )
        )}
      </div>
      <div>
        <MoreSideBarButton />
      </div>
    </nav>
  );
}
