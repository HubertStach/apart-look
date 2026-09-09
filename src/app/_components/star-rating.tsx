"use client";

interface StarRatingProps {
  value: number; // 0..5
  onChange: (value: number) => void;
  label: string;
}

/** Klikalna ocena ważności preferencji: 0..5 gwiazdek. */
export function StarRating({ value, onChange, label }: StarRatingProps) {
  return (
    <div className="flex items-center gap-1" role="group" aria-label={`Waga: ${label}`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          aria-label={`${star} z 5`}
          aria-pressed={star <= value}
          onClick={() => onChange(star === value ? 0 : star)}
          className={`text-lg leading-none transition-colors ${
            star <= value ? "text-amber-500" : "text-slate-300 hover:text-amber-300"
          }`}
        >
          ★
        </button>
      ))}
      <span className="ml-1 w-4 text-xs text-slate-400">{value || "–"}</span>
    </div>
  );
}
