'use client';

import React, { useState } from 'react';
import SimpleTab from '@client-common/components/navigations/Tabs/SimpleTab';

export default function SampleTabPage() {
  // State to keep track of the selected tab index
  const [tabIndex, setTabIndex] = useState(0);

  // Define the tabs with labels and content
  const tabs = [
    { label: 'Tab 1', content: <div>This is the content of Tab 1.</div> },
    { label: 'Tab 2', content: <div>This is the content of Tab 2.</div> },
    { label: 'Tab 3', content: <div>This is the content of Tab 3.</div> },
  ];

  return (
    <div>
      <h1>SimpleTab Component Sample</h1>
      {/* Render the SimpleTab component with tabs and state handlers */}
      <SimpleTab tabs={tabs} tabIndex={tabIndex} onChange={setTabIndex} />
    </div>
  );
}

// This page demonstrates the usage of the SimpleTab component.
// It provides a basic example with three tabs and their respective content.
// Users can switch between tabs and see the content change accordingly.
// This helps in understanding how to use the SimpleTab component in practice.
