'use client';

import React from 'react';
import BasicStack from '@client-common/components/Layout/Stacks/BasicStack';
import DirectionStack from '@client-common/components/Layout/Stacks/DirectionStack';
import ContainedButton from '@client-common/components/inputs/Buttons/ContainedButton';

export default function SampleStacksPage() {
  return (
    <div>
      <h1>Stacks Sample Page</h1>

      <section>
        <h2>BasicStack Example</h2>
        <BasicStack spacing={2}>
          <ContainedButton label="Button 1" onClick={() => alert('Button 1 clicked')} />
          <ContainedButton label="Button 2" onClick={() => alert('Button 2 clicked')} />
          <ContainedButton label="Button 3" onClick={() => alert('Button 3 clicked')} />
        </BasicStack>
      </section>

      <section style={{ marginTop: '2rem' }}>
        <h2>DirectionStack Example</h2>
        <DirectionStack spacing={2} justifyContent="flex-start" alignItems="center">
          <ContainedButton label="Button A" onClick={() => alert('Button A clicked')} />
          <ContainedButton label="Button B" onClick={() => alert('Button B clicked')} />
          <ContainedButton label="Button C" onClick={() => alert('Button C clicked')} />
        </DirectionStack>
      </section>
    </div>
  );
}
