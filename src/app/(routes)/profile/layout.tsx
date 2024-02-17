import React from "react";
import Container from "@mui/material/Container";

// import ProfileTabs from "@/app/components/ProfileTabs";
// import ProfileLayoutContents from "@/app/components/ProfileLayoutContents";
import ProfileTabs from "../../components/ProfileTabs";
import ProfileLayoutContents from "../../components/ProfileLayoutContents";


export default function ProfileLayout({ children }) {
  return (
    <Container maxWidth="lg" className="px-28">
      <ProfileLayoutContents />
      <ProfileTabs />
      {children}
    </Container>
  );
}
