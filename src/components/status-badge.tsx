import { Badge } from "@/components/ui/badge";
import type { Asset } from "@/data/catalog";
import { isModelConfirmed, useLedger } from "@/lib/store";

export function StatusBadge({ asset }: { asset: Asset }) {
  const assignment = useLedger((s) => s.assignments[asset.id]);
  if (asset.needsHardwareModel && isModelConfirmed(asset, assignment)) {
    return <Badge tone="ok">Modello confermato</Badge>;
  }
  if (asset.needsHardwareModel) {
    return <Badge tone="pending">Modello in attesa</Badge>;
  }
  if (asset.confidence === "uncertain") {
    return <Badge tone="uncertain">Da confermare</Badge>;
  }
  return <Badge>Catalogato</Badge>;
}

export function ConfidenceBadge({ asset }: { asset: Asset }) {
  if (asset.confidence === "uncertain") {
    return <Badge tone="uncertain">Osservazione incerta</Badge>;
  }
  return <Badge tone="accent">Visto in lastra</Badge>;
}
