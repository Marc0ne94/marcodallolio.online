import { createFileRoute } from "@tanstack/react-router";
import { FlockApp } from "@/components/flock-app";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  return <FlockApp />;
}
