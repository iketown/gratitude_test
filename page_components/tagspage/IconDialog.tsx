import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogActions,
  Grid,
  DialogContent,
} from "@mui/material";

interface IconDialogI {
  open: boolean;
  handleClose: () => void;
  tag: Tag;
}
const IconDialog: React.FC<IconDialogI> = ({ open, handleClose }) => {
  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Icon Dialog</DialogTitle>
      <DialogContent>choose an icon for blahblah</DialogContent>
    </Dialog>
  );
};

export default IconDialog;
