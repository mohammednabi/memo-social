"use client";

// import { StoreContext } from "@/app/contexts/StoreContext";
import { StoreContext } from "../app/contexts/StoreContext";

// import { store } from "@/stores";

import { store } from "../stores";


import React, { useContext } from "react";

const StoreContextProvider = ({ children }) => {
  return (
    <StoreContext.Provider value={store}>{children}</StoreContext.Provider>
  );
};

export default StoreContextProvider;
