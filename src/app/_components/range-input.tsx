"use client";

interface RangeInputProps {
  min: number | null;
  max: number | null;
  onMinChange: (v: number | null) => void;
  onMaxChange: (v: number | null) => void;
  unit?: string;
  step?: number;
}

function toNum(v: string): number | null {
  if (v.trim() === "") return null;
  const n = Number.parseInt(v, 10);
  return Number.isFinite(n) ? n : null;
}

/** Para pól min/max (cena, powierzchnia). */
export function RangeInput({
  min,
  max,
  onMinChange,
  onMaxChange,
  unit,
  step = 1,
}: RangeInputProps) {
  return (
    <div className="flex items-center gap-2">
      <input
        type="number"
        inputMode="numeric"
        step={step}
        placeholder="min"
        value={min ?? ""}
        onChange={(e) => onMinChange(toNum(e.target.value))}
        className="w-full rounded-md border border-linen bg-cream/60 px-2 py-1 text-sm text-cocoa placeholder:text-mocha/50 focus:border-clay focus:outline-none focus:ring-1 focus:ring-clay/40"
      />
      <span className="text-mocha/60">–</span>
      <input
        type="number"
        inputMode="numeric"
        step={step}
        placeholder="max"
        value={max ?? ""}
        onChange={(e) => onMaxChange(toNum(e.target.value))}
        className="w-full rounded-md border border-linen bg-cream/60 px-2 py-1 text-sm text-cocoa placeholder:text-mocha/50 focus:border-clay focus:outline-none focus:ring-1 focus:ring-clay/40"
      />
      {unit && <span className="text-xs whitespace-nowrap text-mocha/70">{unit}</span>}
    </div>
  );
}
