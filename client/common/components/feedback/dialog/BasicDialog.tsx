import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';

interface BasicDialogProps {
  open: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  children?: React.ReactNode;
  actions?: React.ReactNode;
}

const BasicDialog: React.FC<BasicDialogProps> = ({ open, onClose, title, children, actions }) => {
  return (
    <Dialog open={open} onClose={onClose} aria-labelledby="basic-dialog-title">
      {title && <DialogTitle id="basic-dialog-title">{title}</DialogTitle>}
      <DialogContent dividers>{children}</DialogContent>
      {actions && <DialogActions>{actions}</DialogActions>}
    </Dialog>
  );
};

export default BasicDialog;
