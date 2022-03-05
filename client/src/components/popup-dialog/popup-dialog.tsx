import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import React from "react";

export interface PopupDialogProps {
  title: string;
  content: string;
  open: boolean;
  closePopup: () => void;
}
const PopupDialog = (props: PopupDialogProps) => {

  const handleClose = () => {
    props.closePopup();
  };

  return (
    <div>
      <Dialog
        open={props.open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {props.title}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {props.content}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Understood</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default PopupDialog;
