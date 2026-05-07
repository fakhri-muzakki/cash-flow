"use client";

import { useState } from "react";
import { DatePicker } from "@/components/date-picker";

export default function Example() {
  const [date, setDate] = useState<Date | undefined>();

  return (
    <div className="max-w-sm">
      <DatePicker value={date} onChange={setDate} />
    </div>
  );
}
