import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input, Label, Textarea } from "@/components/ui/field";
import type { Asset } from "@/data/catalog";
import { resolvedNotes, useLedger } from "@/lib/store";

export function ModelForm({ asset }: { asset: Asset }) {
  const assignment = useLedger((s) => s.assignments[asset.id]);
  const setDraft = useLedger((s) => s.setDraft);
  const confirm = useLedger((s) => s.confirm);
  const clear = useLedger((s) => s.clear);

  const catalogModel = asset.confirmedModel ?? "";
  const [model, setModel] = useState(assignment?.model || catalogModel);
  const [notes, setNotes] = useState(assignment?.notes || resolvedNotes(asset, assignment));

  if (!asset.needsHardwareModel) {
    return (
      <p className="rounded-[var(--radius-md)] bg-raised px-4 py-3 text-sm text-muted">
        Questo elemento è catalogato come arredo o accessorio. Non richiede uno SKU
        hardware — resta col nome generico.
      </p>
    );
  }

  return (
    <form
      className="space-y-4"
      onSubmit={(e) => {
        e.preventDefault();
        setDraft(asset.id, { model, notes });
        confirm(asset.id);
      }}
    >
      <div className="space-y-2">
        <Label htmlFor={`model-${asset.id}`}>Modello hardware reale</Label>
        <Input
          id={`model-${asset.id}`}
          value={model}
          onChange={(e) => {
            setModel(e.target.value);
            setDraft(asset.id, { model: e.target.value, notes });
          }}
          placeholder="Incolla qui il modello. Non lo inventiamo noi."
          autoComplete="off"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor={`notes-${asset.id}`}>Note</Label>
        <Textarea
          id={`notes-${asset.id}`}
          value={notes}
          onChange={(e) => {
            setNotes(e.target.value);
            setDraft(asset.id, { model, notes: e.target.value });
          }}
          placeholder="Diagonale, accessori, variante colore…"
        />
      </div>
      <div className="flex flex-wrap gap-2">
        <Button type="submit" disabled={!model.trim()}>
          Conferma modello
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            setModel(catalogModel);
            setNotes(asset.confirmedNotes ?? "");
            clear(asset.id);
          }}
        >
          Ripristina
        </Button>
      </div>
    </form>
  );
}
