"use client"
import { Stack } from '@mui/material';
import { observer } from 'mobx-react-lite';
import React from 'react'
import Confetti from 'react-confetti-boom';


const SuccessfulPost = () => {
  return (
    <Stack className=" h-[25rem] justify-center items-center gap-3 p-3">
      <Confetti
        mode="fall"
        particleCount={100}
        shapeSize={14}
        colors={["#00f497", "#00f3f4", "#d400f4", "#00f5d0"]}

        //  " linear-gradient(45deg, rgba(0,244,151,1) 0%, rgba(0,243,244,1) 57%, rgba(212,0,244,1) 100%)",
      />
      <h1
        className="text-5xl font-bold text-center "
        style={{
          background:
            " linear-gradient(45deg, rgba(0,244,151,1) 0%, rgba(0,243,244,1) 57%, rgba(212,0,244,1) 100%)",
          backgroundClip: "text",
          color: "transparent",
        }}
      >
        <span className="text-white text-xl">✨</span> congratulations{" "}
        <span className="text-white text-xl">✨</span>
      </h1>
      <h2 className="text-lg text-stone-400 text-center">
        your post was shared successfully{" "}
      </h2>
    </Stack>
  );
};


export default observer(SuccessfulPost)