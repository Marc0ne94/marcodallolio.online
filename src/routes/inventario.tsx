import { Outlet, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/inventario")({ component: InventarioLayout });

function InventarioLayout() {
  return <Outlet />;
}
