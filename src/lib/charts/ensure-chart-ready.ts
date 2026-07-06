const DEGENERATE_PATH =
  /^(M0,0|M0 0|M0,0Z|M0,0z|M0 0 0 0)$/i;

function hasDegenerateMarkers(container: HTMLElement): boolean {
  for (const path of container.querySelectorAll("path[d]")) {
    const d = path.getAttribute("d")?.trim();
    if (d && DEGENERATE_PATH.test(d)) return true;
  }
  return false;
}

/** Wait for Recharts to finish layout before SVG/PNG/PDF export. */
export async function ensureChartReady(
  container: HTMLElement,
  maxAttempts = 24
): Promise<void> {
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const svg = container.querySelector("svg");
    const rect = svg?.getBoundingClientRect();
    const sized = !!rect && rect.width > 0 && rect.height > 0;
    if (sized && !hasDegenerateMarkers(container)) return;

    window.dispatchEvent(new Event("resize"));
    await new Promise<void>((resolve) => {
      requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
    });
  }
}
