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

      {/* BasicDialog with onConfirm, confirmText, closeText */}
      <BasicDialog
        open={open}
        title="Sample Dialog"
        onClose={handleClose}
        onConfirm={handleConfirm}
        confirmText="Confirm"
        closeText="Cancel"
      >
        <div>This is a sample dialog content.</div>
      </BasicDialog>

      {/* BasicDialog without onConfirm */}
      <BasicDialog
        open={open}
        title="Dialog without Confirm"
        onClose={handleClose}
        closeText="Close"
      >
        <div>This dialog has no confirm button.</div>
      </BasicDialog>

      {/* BasicDialog with custom confirmText and closeText */}
      <BasicDialog
        open={open}
        title="Custom Texts"
        onClose={handleClose}
        onConfirm={handleConfirm}
        confirmText="Yes"
        closeText="No"
      >
        <div>Dialog with custom confirm and close texts.</div>
      </BasicDialog>

      {/* BasicDialog with only closeText */}
      <BasicDialog
        open={open}
        title="Only Close Text"
        onClose={handleClose}
        closeText="Dismiss"
      >
        <div>Dialog with only close button text customized.</div>
      </BasicDialog>
    </div>
  );
}
