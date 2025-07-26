'use client';

import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';

export type BasicDialogProps = {
  open: boolean;
  title?: React.ReactNode;
  children?: React.ReactNode;
  onClose: () => void;
  onConfirm?: () => void;
  confirmText?: string;
  cancelText?: string;
};

export default function BasicDialog({
  open,
  title,
  children,
  onClose,
  onConfirm,
  confirmText = 'OK',
  cancelText = 'Cancel',
}: BasicDialogProps) {
  return (
    <Dialog open={open} onClose={onClose} aria-labelledby="basic-dialog-title">
      {title && <DialogTitle id="basic-dialog-title">{title}</DialogTitle>}
      <DialogContent dividers>{children}</DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          {cancelText}
        </Button>
        {onConfirm && (
          <Button onClick={onConfirm} color="primary" autoFocus>
            {confirmText}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}
