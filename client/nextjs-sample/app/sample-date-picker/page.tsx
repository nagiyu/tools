import * as React from 'react';
import { useState } from 'react';
import { BasicDatePicker } from '@client-common/components/inputs/Dates/BasicDatePicker';

export default function SampleDatePickerPage() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  return (
    <main>
      <h1>Sample Date Picker</h1>
      <BasicDatePicker
        value={selectedDate}
        onChange={setSelectedDate}
      />
      <p>\u9078\u629e\u3055\u308c\u305f\u65e5\u4ed8: {selectedDate ? selectedDate.toLocaleDateString() : '\u306a\u3057'}</p>
    </main>
  );
}
