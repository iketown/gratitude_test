import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { format } from "date-fns";
import type { FC } from "react";
import React from "react";
import { FaArrowLeft, FaTrashAlt } from "react-icons/fa";
import { usePostCtx } from "~/contexts/PostCtx";
import { useToast } from "~/hooks/useToast";

interface RemovePostWarningModalI {
  open: boolean;
  onClose: () => void;
  post: Post;
  selectedDate: Date;
}
const RemovePostWarningModal: FC<RemovePostWarningModalI> = ({
  open,
  onClose,
  post,
  selectedDate,
}) => {
  const { toast } = useToast();
  const { removePost, postRecordsByDate } = usePostCtx();
  const handleRemove = async () => {
    const post_id = format(selectedDate, "yyyy-MM-dd");
    onClose();
    await removePost(post_id, post.tags || []);
    toast("post removed", "success");
  };
  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">
        Remove the post on {format(selectedDate, "eee MMM d")} ?
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          This can't be undone
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button startIcon={<FaArrowLeft />} onClick={onClose}>
          Cancel & keep post
        </Button>
        <Button
          startIcon={<FaTrashAlt />}
          color="warning"
          onClick={handleRemove}
          autoFocus
        >
          Yes, Delete it
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default RemovePostWarningModal;
