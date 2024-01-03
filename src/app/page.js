import Image from "next/image";
import StoriesSection from "./components/StoriesSection";
import PostsSection from "./components/PostsSection";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import SuggestedFriendsSection from "./components/SuggestedFriendsSection";

export default function Home() {
  return (
    <Grid2 container>
      <Grid2 xs={8} className="min-h-screen flex flex-col  items-center">
        <StoriesSection />
        <PostsSection />
      </Grid2>
      <Grid2 xs={4}>
        <SuggestedFriendsSection />
      </Grid2>
    </Grid2>
  );
}
