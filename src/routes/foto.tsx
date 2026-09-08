import { Outlet, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/foto")({ component: FotoLayout });

function FotoLayout() {
  return <Outlet />;
}
