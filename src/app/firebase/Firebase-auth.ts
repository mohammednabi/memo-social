import { app } from "./FireBase-config";
import { getAuth } from "firebase/auth";

export const auth = getAuth(app);

export const user = auth.currentUser;
