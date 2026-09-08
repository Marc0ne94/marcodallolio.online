import { createFileRoute } from "@tanstack/react-router";
import { StudioPage } from "@/components/studio/studio-page";

type Search = { solo?: string };

export const Route = createFileRoute("/")({
  ssr: false,
  validateSearch: (raw: Record<string, unknown>): Search => ({
    solo: typeof raw.solo === "string" ? raw.solo : undefined,
  }),
  component: StudioRoute,
});

function StudioRoute() {
  const { solo } = Route.useSearch();
  return <StudioPage initialSolo={solo} />;
}
