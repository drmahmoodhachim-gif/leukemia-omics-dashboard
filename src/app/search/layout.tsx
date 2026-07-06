import { pageMetadata, PAGE_DESCRIPTIONS } from "@/lib/metadata";

export const metadata = pageMetadata("Search Library", PAGE_DESCRIPTIONS.search, {
  path: "/search",
});

export default function SearchLayout({ children }: { children: React.ReactNode }) {
  return children;
}
