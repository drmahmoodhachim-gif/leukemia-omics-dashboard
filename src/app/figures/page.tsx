import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { getHydratedFigures } from "@/lib/data/hydrate-figures";
import { FiguresGallery } from "./FiguresGallery";
import { FiguresHashScroll } from "./FiguresHashScroll";
import { pageMetadata, PAGE_DESCRIPTIONS } from "@/lib/metadata";

export const metadata = pageMetadata(
  "Figures & Tables",
  PAGE_DESCRIPTIONS.figures,
  { path: "/figures" }
);

export default function FiguresPage() {
  const galleryFigures = getHydratedFigures();

  return (
    <DashboardLayout activePath="/figures">
      <FiguresHashScroll />
      <div className="space-y-6">
        <header>
          <h1 className="font-serif text-3xl font-bold">Figures &amp; Tables</h1>
          <p className="mt-2 text-muted-foreground">
            Publication-ready visualizations with SVG, PNG, and PDF export for
            manuscripts.
          </p>
        </header>
        <FiguresGallery figures={galleryFigures} />
      </div>
    </DashboardLayout>
  );
}
