import React from 'react'

interface iprops{
    createdTime: number
    createdDate:string
}

const TimeOfPost = ({createdTime,createdDate}:iprops) => {
   const timeNow = new Date();

    const timeDifference = Math.floor(
      (timeNow.getTime() - createdTime) / 1000
    ); // Calculate the time difference in seconds

    const daysDifference = Math.floor(timeDifference / (24 * 60 * 60));
    const hoursDifference = Math.floor((timeDifference / (60 * 60)) % 24);
    const minutesDifference = Math.floor((timeDifference / 60) % 60);
    const secondsDifference = Math.floor(timeDifference % 60);

    if (daysDifference > 7) {
      return (
        <h3 className="text-stone-950/50 dark:text-white/25">
          {createdDate}
        </h3>
      );
    } else if (daysDifference > 0) {
      return (
        <h3 className="text-stone-950/50 dark:text-white/25">
          {daysDifference} d
        </h3>
      );
    } else if (hoursDifference > 0) {
      return (
        <h3 className="text-stone-950/50 dark:text-white/25">
          {hoursDifference} h
        </h3>
      );
    } else if (minutesDifference > 0) {
      return (
        <h3 className="text-stone-950/50 dark:text-white/25">
          {minutesDifference} m
        </h3>
      );
    } else if (secondsDifference > 0) {
      return (
        <h3 className="text-stone-950/50 dark:text-white/25">
          {secondsDifference} s
        </h3>
      );
    }
  };


export default TimeOfPost