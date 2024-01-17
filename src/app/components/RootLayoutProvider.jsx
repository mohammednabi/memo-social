"use client";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import { usePathname, useRouter } from "next/navigation";

import React, { useEffect, useState } from "react";
import SideBar from "./SideBar";
import { UserContext } from "../contexts/user";
import { auth } from "../firebase/Firebase-auth";
import { onAuthStateChanged } from "firebase/auth";
import { LinearProgress, StyledEngineProvider } from "@mui/material";
import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import { db } from "../firebase/FireBase-config";
import { addUser } from "../functions/updateDocument";

export default function RootLayoutProvider({ children }) {
  const pathName = usePathname();
  const router = useRouter();
  const [user, setUser] = useState();

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loading
      ? (document.body.style.overflow = "hidden")
      : (document.body.style.overflow = "unset");
  }, [loading]);

  onAuthStateChanged(auth, (currentUser) => {
    // console.log("this is the cure nt user : ", currentUser);
    if (currentUser && !user) {
      getCurrentUser(currentUser);
    }
    // setUser(currentUser);

    if (!currentUser) {
      pathName !== "/signup" ? router.push("/login") : router.push("/signup");
      setLoading(true);
    } else {
      setLoading(false);
    }
  });

  const getCurrentUser = (currentUser) => {
    const userRef = doc(db, "users", `${currentUser.uid}`);
    getDoc(userRef)
      .then((doc) => {
        // console.log("this is the document of users : ", doc.data().data);
        if (doc) {
          setUser(doc.data().data);
        } else {
          addUser(currentUser.uid, {
            displayName: currentUser.displayName,
            uid: currentUser.uid,
            userName: "",
            bio: "",
            photoURL: currentUser.photoURL,
            // links: user ? user.links : links,
            link: "",
            followers: [],
            following: [],
          });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <StyledEngineProvider injectFirst>
      {pathName !== "/login" && pathName !== "/signup" ? (
        <UserContext.Provider value={user}>
          {loading && <LoadingCircle />}
          <Grid2 container>
            <Grid2 xs={2}>
              <SideBar />
            </Grid2>
            <Grid2 xs={10}>{children}</Grid2>
          </Grid2>
        </UserContext.Provider>
      ) : (
        <>{children}</>
      )}
    </StyledEngineProvider>
  );
}

const LoadingCircle = () => {
  return (
    <div
      className="absolute z-50 top-0 left-0 w-screen h-screen flex justify-center items-center "
      style={{
        background:
          "radial-gradient(circle, rgba(0,0,0,1) 0%, rgba(0,0,0,0.9) 100%)",
      }}
    >
      <div className="flex justify-center items-center relative">
        <div
          className="absolute animate-spin bg-red-200 w-24 aspect-square rounded-full flex justify-center items-center"
          style={{
            background:
              " linear-gradient(45deg, rgba(0,244,151,1) 0%, rgba(0,243,244,1) 57%, rgba(212,0,244,1) 100%)",
          }}
        >
          <div className="absolute bg-black w-28 h-1/2 top-0 aspect-square rounded-t-full  "></div>
        </div>
        <div className="absolute bg-black w-20  aspect-square rounded-full border-t-8 border-solid border-black"></div>
      </div>
    </div>
  );
};
