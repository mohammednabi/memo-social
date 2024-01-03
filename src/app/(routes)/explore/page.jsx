import React from "react";

export default function ExplorePage() {
  return (
    <section className="flex flex-col gap-2 p-5 px-40">
      <div className="grid grid-cols-3 gap-1">
        <div className="grid grid-rows-2 gap-1">
          <img
            className="w-auto h-auto aspect-square "
            alt=""
            src="/getflex3 ad.jpg"
          />
          <img
            className="w-auto h-auto aspect-square "
            alt=""
            src="/getflex3 ad.jpg"
          />
        </div>

        <div className="grid grid-rows-2 gap-1">
          <img
            className="w-auto h-auto aspect-square"
            alt=""
            src="/getflex3 ad.jpg"
          />
          <img
            className="w-auto h-auto aspect-square"
            alt=""
            src="/getflex3 ad.jpg"
          />
        </div>

        <div className="grid grid-rows-1 gap-1">
          <img
            className="w-auto h-full aspect-story"
            alt=""
            src="/2151024897.jpg"
          />
        </div>
      </div>{" "}
    </section>
  );
}
