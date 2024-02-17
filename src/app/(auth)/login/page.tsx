"use client";
import Link from "next/link";
import React, { useContext, useState } from "react";
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  Auth,
  AuthProvider,
} from "firebase/auth";
// import { auth } from "@/app/firebase/Firebase-auth";
import { auth } from "../../firebase/Firebase-auth";

import CircularProgress from "@mui/material/CircularProgress";
import { useRouter } from "next/navigation";
// import { StoreContext } from "@/app/contexts/StoreContext";
import { StoreContext } from "../../contexts/StoreContext";

import { observer } from "mobx-react-lite";

 const LoginPage=()=> {
  const [userInfo, setUserInfo] = useState({
    email: "",
    password: "",
  });
  const router = useRouter();

  const { currentUser } = useContext(StoreContext);

  const [loading, setLoading] = useState<boolean>(false);
  const [err, setErr] = useState<string>("");

  const provider = new GoogleAuthProvider();

  const login = async (email: string, pass: string) => {
  
    setLoading(true)
    await signInWithEmailAndPassword(auth, email, pass).then((user) => {
      const data = {
          data: {
            bio: "",
            followers: [],
            following: [],
            link: "",
            username: "",
          },
      };
      
      currentUser.addUserToUserCollection(user.user.uid, data).then(() => {
        setLoading(false)
        router.push("/")
        
      }).catch((err) => {
        console.log(err.message)
      });
    }).catch((err) => {
      console.log(err.message)
      setErr(err.message.slice(9))
      setLoading(false)
    })


  };

  const googleLogin =async (auth: Auth, provider: AuthProvider) => {
 await   signInWithPopup(auth, provider)
      .then((user) => {
      
          const data = {
            data: {
              bio: "",
              followers: [],
              following: [],
              link: "",
              username: "",
            },
          };

        currentUser.addUserToUserCollection(user.user.uid, data).then(() => {
        router.push("/")
       
        
      }).catch((err) => {
        console.log(err.message)
      });
      })
      .catch((err) => {

        console.log(err.message);
      
      });
  };

  return (
    <div className="w-screen h-screen grid place-items-center">
      <div className="flex flex-col p-10 w-96 h-auto  bg-stone-950 rounded-xl font-insta gap-5">
        <div className="flex gap-2  items-center">
          <img alt="" src="/memoLogo.ico" className="w-10 h-10" />
          <h1 className="text-white text-3xl uppercase">memo</h1>
        </div>
        <h1 className="text-white/50 text-2xl capitalize">log in</h1>
        <form
          className="w-full h-auto flex flex-col gap-2"
          onSubmit={(e) => {
            e.preventDefault();

            // console.log(userInfo);
            login(userInfo.email, userInfo.password);
          }}
        >
          <label className="capitalize text-white/50">email</label>
          <input
            type="email"
            required
            value={userInfo.email}
            onChange={(e) => {
              setUserInfo({
                email: e.target.value,
                password: userInfo.password,
              });
              setErr("");
            }}
            className="w-full h-full bg-stone-950 rounded-lg border-white/5 border-2 border-solid focus:outline-none focus:border-white/10 p-2 text-white/50"
          />
          <label className="capitalize text-white/50">password</label>
          <input
            type="password"
            value={userInfo.password}
            required
            onChange={(e) => {
              setUserInfo({
                password: e.target.value,
                email: userInfo.email,
              });
              setErr("");
            }}
            className="w-full h-full bg-stone-950 rounded-lg border-white/5 border-2 border-solid focus:outline-none focus:border-white/10 p-2 text-white/50"
          />

          {err.length > 0 && (
            <h1 className="text-sm text-red-600 capitalize">{err}</h1>
          )}
          <button className="flex justify-center items-center capitalize bg-stone-900 transition-colors hover:bg-stone-800 text-white/50 text-xl py-2 px-5 rounded-xl">
            {!loading ? (
              <h1>log in</h1>
            ) : (
              <CircularProgress className="text-stone-400" size={30} />
            )}
          </button>
        </form>
        <h1 className="text-white/50 text-sm text-center uppercase">
          -------- or --------
        </h1>
        <div
          onClick={() => {
            googleLogin(auth, provider);
          }}
          className="cursor-pointer capitalize flex justify-center items-center gap-2 bg-stone-900 transition-colors hover:bg-stone-800 text-white/50 text-sm py-2 px-5 rounded-xl"
        >
          <h1>sign in with google</h1>
          <img
            src="https://www.freepnglogos.com/uploads/google-logo-png/google-logo-png-webinar-optimizing-for-success-google-business-webinar-13.png"
            alt="google logo"
            loading="lazy"
            className="w-10 h-10"
          />
        </div>
        <div className="flex gap-2 items-center text-white/50">
          <h1 className="capitalize">new account ?</h1>
          <Link href={"/signup"} className="capitalize text-blue-400 underline">
            register
          </Link>
        </div>
      </div>
    </div>
  );
}


export default observer (LoginPage)