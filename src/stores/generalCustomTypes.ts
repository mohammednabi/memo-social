type author = {
  avatar: string;
  email: string;
  id: string;
  name: string;
};

type comment = {
  author: author;
  content: string;
  id: string;
};

type timestamp = {
  created: {
    date: string;
    time: number;
  };
  updated: {
    date: string;
    time: number;
  };
};

export type post = {
  id: string;
  author: author;
  comments: comment[];
  description: string;
  likes: string[];
  media: string;
  mediaType: string;
  timestamp: timestamp;
};

export type defaultUser = {
  uid: string;
  displayName: string;
  email: string;
  photoURL: string;
  data: {
    bio: string;
    followers: string[];
    following: string[];
    link: string;
    username: string;
  };
};
