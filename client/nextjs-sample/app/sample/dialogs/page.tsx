"use client";

import React, { useState } from "react";
import BasicDialog from "client/common/components/feedback/dialog/BasicDialog";
import Button from "@mui/material/Button";

const SampleDialogsPage: React.FC = () => {
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <div>
      <h1>BasicDialog Sample</h1>
      <Button variant="contained" onClick={handleOpen}>
        Open Dialog
      </Button>

      <BasicDialog
        open={open}
        onClose={handleClose}
        title="Sample Dialog Title"
        actions={
          <>
            <Button onClick={handleClose} color="primary">
              Cancel
            </Button>
            <Button onClick={handleClose} color="primary" autoFocus>
              OK
            </Button>
          </>
        }
      >
        <p>This is a sample dialog content.</p>
      </BasicDialog>
    </div>
  );
};

export default SampleDialogsPage;
