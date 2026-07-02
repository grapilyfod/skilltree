"use client";

import { useEffect, useState } from "react";
import { formatClock, formatDayLabel } from "@/lib/time";

export function LiveClock() {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    // Set the initial time only after mount so server and client markup match;
    // the clock is inherently client-only state.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setNow(new Date());
    const intervalId = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="flex items-baseline gap-2 font-mono text-sm text-zinc-400">
      <span className="text-zinc-200">{now ? formatClock(now) : "--:--:--"}</span>
      <span className="text-zinc-600">·</span>
      <span>{now ? formatDayLabel(now) : ""}</span>
    </div>
  );
}
