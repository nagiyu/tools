'use client';

import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';

import LoadingContent from '@client-common/components/content/LoadingContent';

export interface BasicDialogProps {
  open: boolean;
  title?: string;
  children: (
    loading: boolean,
    runWithLoading: <T>(func: () => Promise<T>) => Promise<T>
  ) => React.ReactNode;
  onClose: () => void;
  onConfirm?: () => Promise<void>;
  confirmText?: string;
  closeText?: string;
};

export default function BasicDialog({
  open,
  title,
  children,
  onClose,
  onConfirm,
  confirmText = 'OK',
  closeText = 'Cancel',
}: BasicDialogProps) {
  return (
    <LoadingContent>
      {(loading, runWithLoading) => (
        <Dialog open={open} onClose={onClose} aria-labelledby="basic-dialog-title">
          <DialogTitle id="basic-dialog-title">{title}</DialogTitle>
          <DialogContent dividers>{children(loading, runWithLoading)}</DialogContent>
          <DialogActions>
            <Button onClick={onClose} color="primary" disabled={loading}>
              {closeText}
            </Button>
            {onConfirm && (
              <Button onClick={() => runWithLoading(onConfirm)} color="primary" autoFocus disabled={loading}>
                {confirmText}
              </Button>
            )}
          </DialogActions>
        </Dialog>
      )}
    </LoadingContent>
  );
}
