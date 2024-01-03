import { Inter } from "next/font/google";
import "./globals.css";

import RootLayoutProvider from "./components/RootLayoutProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "MEMO SOCIAL",
  description: "instagram clone",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark" id="big-parent">
      <body className={inter.className}>
        <RootLayoutProvider>{children}</RootLayoutProvider>
      </body>
    </html>
  );
}
