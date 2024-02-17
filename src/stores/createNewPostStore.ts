import { makeAutoObservable } from "mobx";
import { defaultUser } from "./generalCustomTypes";
import { addDoc } from "firebase/firestore";
import { postsCol } from "../app/firebase/FireBase-config";
import {
  StorageReference,
  UploadTask,
  getDownloadURL,
  getStorage,
  ref,
  uploadBytes,
  uploadBytesResumable,
} from "firebase/storage";
import { v4 as uuidv4 } from "uuid";

export class newPost {
  isPostUploaded: boolean = false;
  isUploading: boolean = false;
  inputComment: string = "";
  emojiClicked: boolean = false;
  selectedMediaUrl: string = null;
  selectedMediaType: string = null;
  selectedMediaObj: File = null;
  private uploadedMediaTask: UploadTask = null;
  totalMediaProgress: number = 0;

  private mediaReference: StorageReference = null;

  constructor() {
    makeAutoObservable(this);
  }

  resetAllStates = () => {
    this.selectedMediaUrl = null;
    this.selectedMediaType = null;
    this.selectedMediaObj = null;
    this.inputComment = "";
    this.emojiClicked = false;
    this.isUploading = false;
    this.isPostUploaded = false;
  };

  back = () => {
    this.selectedMediaUrl = null;
  };

  private uploadTheMedia = async () => {
    if (this.selectedMediaUrl === null) return;
    const storage = getStorage();
    const mediaRef = ref(
      storage,
      `/images/${this.selectedMediaObj.name + uuidv4()}`
    );

    this.mediaReference = mediaRef;

    console.log("this is file size : ", this.selectedMediaObj.size);

    const uploadMediaTask = uploadBytesResumable(
      mediaRef,
      this.selectedMediaObj
    );

    // this.uploadedMediaTask = uploadMedia;

    uploadMediaTask.on("state_changed", (snapshot) => {
      this.totalMediaProgress =
        (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
    });

    return uploadMediaTask;

    // .then((uploadResult) => {
    //   alert("media uploaded successfully");
    //   this.isUploading = false;
    // })
    // .catch((err) => {
    //   this.isUploading = false;
    //   alert("error occur while uploading media");
    //   console.log(err);
    // });
  };

  private addTheNewPost = async (
    user: defaultUser,
    mediaDownloadUrl: string
  ) => {
    this.isPostUploaded = false;
    const postDate = new Date();

    const newPost = {
      author: {
        id: user.uid,
        name: user.displayName,
        avatar: user.photoURL,
        email: user.email,
      },

      description: this.inputComment,
      media: mediaDownloadUrl,
      mediaType: this.selectedMediaType,

      timestamp: {
        created: {
          time: postDate.getTime(),
          date: postDate.toLocaleDateString(),
        },
        updated: {
          time: postDate.getTime(),
          date: postDate.toLocaleDateString(),
        },
      },
      likes: [],
      comments: [],
    };

    console.log("333333");

    return await addDoc(postsCol, newPost);
  };

  uploadTheWholePost = async (user: defaultUser) => {
    this.isUploading = true;
    await this.uploadTheMedia()
      .then((uploadedMedia) => {
        this.isUploading = false;
        console.log(
          "this is uploaded media from uploading media : ",
          uploadedMedia
        );
        console.log(
          "this is uploaded media full path from uploading media : ",
          uploadedMedia.ref.fullPath
        );

        if (uploadedMedia.ref.fullPath) {
          console.log("11111");
          getDownloadURL(this.mediaReference)
            .then((url) => {
              console.log("22222");
              console.log("this is url of media : ", url);
              this.addTheNewPost(user, url)
                .then((result) => {
                  console.log("44444");
                  console.log("44444 result :", result);

                  this.isPostUploaded = true;
                })
                .catch((err) => {
                  console.log("error from post after uploading image : ", err);
                });
            })
            .catch((err) => {
              console.log("error from get download url function : ", err);
            });
        }
      })
      .catch((err) => {
        this.isUploading = false;
        console.log("error from uploading image : ", err);
      });
  };

  // calculateUploadProgress = () => {
  //   const totalProgress = this.uploadedMediaTask
  // };
}
