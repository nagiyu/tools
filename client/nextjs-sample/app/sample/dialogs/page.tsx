'use client';

import React, { useState } from 'react';
import BasicDialog from '@client-common/components/feedback/dialog/BasicDialog';
import ContainedButton from '@client-common/components/inputs/Buttons/ContainedButton';

export default function SampleDialogsPage() {
  // Manage open state for each dialog separately
  const [openDialogs, setOpenDialogs] = useState({
    sampleDialog: false,
    noConfirmDialog: false,
    customTextDialog: false,
    onlyCloseTextDialog: false,
  });

  const handleOpen = (dialogName: string) => {
    setOpenDialogs((prev) => ({ ...prev, [dialogName]: true }));
  };

  const handleClose = (dialogName: string) => {
    setOpenDialogs((prev) => ({ ...prev, [dialogName]: false }));
  };

  const handleConfirm = async (dialogName: string) => {
    alert(`Confirmed ${dialogName}!`);
    setOpenDialogs((prev) => ({ ...prev, [dialogName]: false }));
  };

  return (
    <div>
      <h1>Sample Dialogs</h1>
      <ContainedButton
        label="Open Sample Dialog"
        onClick={() => {
          handleOpen('sampleDialog');
        }}
      />
      <ContainedButton
        label="Open Dialog without Confirm"
        onClick={() => {
          handleOpen('noConfirmDialog');
        }}
      />
      <ContainedButton
        label="Open Custom Texts Dialog"
        onClick={() => {
          handleOpen('customTextDialog');
        }}
      />
      <ContainedButton
        label="Open Only Close Text Dialog"
        onClick={() => {
          handleOpen('onlyCloseTextDialog');
        }}
      />

      {/* BasicDialog with onConfirm, confirmText, closeText */}
      <BasicDialog
        open={openDialogs.sampleDialog}
        title="Sample Dialog"
        onClose={() => handleClose('sampleDialog')}
        onConfirm={() => handleConfirm('sampleDialog')}
        confirmText="Confirm"
        closeText="Cancel"
      >
        {() => <div>This is a sample dialog content.</div>}
      </BasicDialog>

      {/* BasicDialog without onConfirm */}
      <BasicDialog
        open={openDialogs.noConfirmDialog}
        title="Dialog without Confirm"
        onClose={() => handleClose('noConfirmDialog')}
        closeText="Close"
      >
        {() => <div>This dialog has no confirm button.</div>}
      </BasicDialog>

      {/* BasicDialog with custom confirmText and closeText */}
      <BasicDialog
        open={openDialogs.customTextDialog}
        title="Custom Texts"
        onClose={() => handleClose('customTextDialog')}
        onConfirm={() => handleConfirm('customTextDialog')}
        confirmText="Yes"
        closeText="No"
      >
        {() => <div>Dialog with custom confirm and close texts.</div>}
      </BasicDialog>

      {/* BasicDialog with only closeText */}
      <BasicDialog
        open={openDialogs.onlyCloseTextDialog}
        title="Only Close Text"
        onClose={() => handleClose('onlyCloseTextDialog')}
        closeText="Dismiss"
      >
        {() => <div>Dialog with only close button text customized.</div>}
      </BasicDialog>
    </div>
  );
}
