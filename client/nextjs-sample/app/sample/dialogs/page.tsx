'use client';

import React, { useState } from 'react';
import BasicDialog from '@client-common/components/feedback/dialog/BasicDialog';
import ContainedButton from '@client-common/components/inputs/Buttons/ContainedButton';

export default function SampleDialogsPage() {
  const [open, setOpen] = useState(false);
  const [dialogContent, setDialogContent] = useState<React.ReactNode>(null);
  const [dialogTitle, setDialogTitle] = useState<React.ReactNode>('Sample Dialog');

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleConfirm = () => {
    alert('Confirmed!');
    setOpen(false);
  };

  return (
    <div>
      <h1>Sample Dialogs</h1>
      <ContainedButton
        label="Open Dialog"
        onClick={() => {
          setDialogTitle('Sample Dialog Title');
          setDialogContent(<p>This is a sample dialog content.</p>);
          handleOpen();
        }}
      />

      <BasicDialog
        open={open}
        title={dialogTitle}
        onClose={handleClose}
        onConfirm={handleConfirm}
        confirmText="Confirm"
        cancelText="Cancel"
      >
        {dialogContent}
      </BasicDialog>
    </div>
  );
}
