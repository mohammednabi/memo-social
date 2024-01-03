"use client";
import React, { useEffect, useState } from "react";

import Stack from "@mui/material/Stack";
import Link from "next/link";
import BookmarkBorderOutlinedIcon from "@mui/icons-material/BookmarkBorderOutlined";
import AssignmentIndOutlinedIcon from "@mui/icons-material/AssignmentIndOutlined";
import { Apps } from "@mui/icons-material";
import { usePathname } from "next/navigation";

export default function ProfileTabs() {
  const pathName = usePathname();
  const [selected, setSelected] = useState({
    posts: false,
    saved: false,
    tagged: false,
  });

  useEffect(() => {
    if (pathName === "/profile/posts") {
      setSelected({ posts: true, saved: false, tagged: false });
    } else if (pathName === "/profile/saved") {
      setSelected({ posts: false, saved: true, tagged: false });
    } else {
      setSelected({ posts: false, saved: false, tagged: true });
    }
  }, [pathName]);

  return (
    <Stack>
      <Stack
        direction={"row"}
        spacing={4}
        justifyContent={"center"}
        alignItems={"center"}
        className="border-t-2 border-white/10 border-solid uppercase "
      >
        <Link href={"/profile/posts"}>
          <Stack
            direction={"row"}
            spacing={1}
            alignItems={"center"}
            className={`border-t-2 transition-all ${
              selected.posts ? "border-white" : "border-white/10"
            } border-solid pt-2 pb-5 text-sm `}
          >
            <Apps
              className={`${selected.posts ? "text-white" : "text-white/25"}`}
              sx={{ fontSize: "1rem" }}
            />
            <h1
              className={`${selected.posts ? "text-white" : "text-white/25"}`}
            >
              posts
            </h1>
          </Stack>
        </Link>
        <Link href={"/profile/saved"}>
          <Stack
            direction={"row"}
            spacing={1}
            alignItems={"center"}
            className={`border-t-2 transition-all ${
              selected.saved ? "border-white" : "border-white/10"
            } border-solid pt-2 pb-5 text-sm `}
          >
            <BookmarkBorderOutlinedIcon
              className={`${selected.saved ? "text-white" : "text-white/25"}`}
              sx={{ fontSize: "1rem" }}
            />
            <h1
              className={`${selected.saved ? "text-white" : "text-white/25"}`}
            >
              saved
            </h1>
          </Stack>
        </Link>
        <Link href={"/profile/tagged"}>
          <Stack
            direction={"row"}
            spacing={1}
            alignItems={"center"}
            className={`border-t-2 transition-all ${
              selected.tagged ? "border-white" : "border-white/10"
            } border-solid pt-2 pb-5 text-sm `}
          >
            <AssignmentIndOutlinedIcon
              className={`${selected.tagged ? "text-white" : "text-white/25"}`}
              sx={{ fontSize: "1rem" }}
            />
            <h1
              className={`${selected.tagged ? "text-white" : "text-white/25"}`}
            >
              tagged
            </h1>
          </Stack>
        </Link>
      </Stack>
    </Stack>
  );
}
