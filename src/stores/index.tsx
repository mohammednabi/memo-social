// const { postsStore } = require("./posts");

import { currentUser } from "./currentUser";
import { postsStore } from "./posts";
import { newPost } from "./createNewPostStore";

const postsInstance = new postsStore();

const userInstance = new currentUser();

const singleNewPostInstance = new newPost()

export const store = {
  posts: postsInstance,
  currentUser: userInstance,
  newPost:singleNewPostInstance
};
