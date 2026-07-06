"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Mount Recharts only after the container has a measurable width (avoids M0,0 marker paths). */
export function ChartContainer({
  height,
  children,
  className,
}: {
  height: number;
  children: (size: { width: number; height: number }) => ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState<{ width: number; height: number } | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const update = () => {
      const width = Math.floor(el.getBoundingClientRect().width);
      if (width > 0) {
        setSize({ width, height });
      }
    };

    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, [height]);

  return (
    <div ref={ref} className={cn("w-full", className)} style={{ height }}>
      {size ? children(size) : null}
    </div>
  );
}
