import { Inter } from "next/font/google";
import "./globals.css";

import RootLayoutProvider from "./components/RootLayoutProvider";
// import StoreContextProvider from "@/providers/StoreContextProvider";
import StoreContextProvider from "../providers/StoreContextProvider";


import React from "react";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "MEMO SOCIAL",
  description: "instagram clone",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark" id="big-parent">
      <body className={inter.className}>
        <RootLayoutProvider>
          <StoreContextProvider>{children}</StoreContextProvider>
        </RootLayoutProvider>
      </body>
    </html>
  );
}
