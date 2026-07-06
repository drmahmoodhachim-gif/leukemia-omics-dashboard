"use client";

import { useEffect } from "react";

/** Scroll to #fig-xxx on load without triggering flaky RSC soft-nav to hash URLs. */
export function FiguresHashScroll() {
  useEffect(() => {
    const hash = window.location.hash.replace(/^#/, "");
    if (!hash) return;
    const el = document.getElementById(hash);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, []);
  return null;
}
