"use client";
// import { deletePost } from "@/app/functions/updateDocument";
import { deletePost } from "../../functions/updateDocument";

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  Modal,
  Paper,
  Stack,
} from "@mui/material";
import React, { useState } from "react";
import EditModal from "./EditModal";

const PostSettingsModal = ({
  open,
  closeModal,
  closeMain,
  post,
  setConfirmDelete,
loadingDelete,
  setLoadingDelete,
}) => {
  const [openDeleteConfirmDialog, setOpenDeleteConfirmDialog] = useState(false);
  const [openPostEditModal, setOpenPostEditModal] = useState(false);

  const handleOpenDeleteConfirmDialog = () => {
    setOpenDeleteConfirmDialog(true);
  };

  const handleCloseDeleteConfirmDialog = () => {
    setOpenDeleteConfirmDialog(false);
  };

  const handleOpenEditPostModal = () => {
    setOpenPostEditModal(true);
  };

  const handleCloseEditPostModal = () => {
    setOpenPostEditModal(false);
  };

  const deleteWholePost = () => {
    setLoadingDelete(true);
    deletePost(post.id, post.media)
      .then(() => {
        setLoadingDelete(false);
        setConfirmDelete(true);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <>
      <Modal
        open={open}
        onClose={closeModal}
        className="
      grid place-items-center border-none outline-none
    "
      >
        <Paper
          className={`bg-stone-950 font-insta  text-2xl   text-white rounded-md   h-auto border-none outline-none  py-5  w-auto`}
        >
          <Stack spacing={2} className="items-center justify-center ">
            <button
              className="text-white/75 capitalize px-20"
              onClick={handleOpenEditPostModal}
            >
              edit
            </button>
            <Divider className="w-full  bg-stone-900" />
            <button
              className="text-red-600 capitalize px-20"
              onClick={() => {
                handleOpenDeleteConfirmDialog();
              }}
            >
              delete
            </button>
          </Stack>

          {/* confirm delete dialog  */}

          <Dialog
            open={openDeleteConfirmDialog}
            onClose={handleCloseDeleteConfirmDialog}
            PaperProps={{
              style: {
                backgroundColor: "rgb(12 10 9)",
                color: "white",
              },
            }}
            // className="bg-stone-950"
          >
            <DialogTitle>Confirm Delete</DialogTitle>
            <DialogContent>
              <DialogContentText className="text-white/75">
                Do you want to delete this post , this means that you won't be
                able to retrieve this post again ?
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button
                color="error"
                onClick={() => {
                  handleCloseDeleteConfirmDialog();
                  closeModal();

                  deleteWholePost();
                }}
              >
                Delete
              </Button>
              <Button onClick={handleCloseDeleteConfirmDialog} autoFocus>
                Cancel
              </Button>
            </DialogActions>
          </Dialog>

          {/* === confirm delete dialog === */}
        </Paper>
      </Modal>
      {openPostEditModal && (
        <EditModal
          open={openPostEditModal}
          close={handleCloseEditPostModal}
          post={post}
          closeMenu={closeModal}
        />
      )}
    </>
  );
};

export default PostSettingsModal;
