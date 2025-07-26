'use client';

import React, { useState } from 'react';
import BasicDialog from '@client-common/components/feedback/dialog/BasicDialog';
import ContainedButton from '@client-common/components/inputs/Buttons/ContainedButton';

export default function SampleDialogsPage() {
  const [open, setOpen] = useState(false);

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
          handleOpen();
        }}
      />

      <BasicDialog
        open={open}
        title="Sample Dialog"
        onClose={handleClose}
        onConfirm={handleConfirm}
        confirmText="Confirm"
        cancelText="Cancel"
      >
        <div>This is a sample dialog content.</div>
      </BasicDialog>
    </div>
  );
}
