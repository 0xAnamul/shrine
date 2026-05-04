"use client";
import { useState } from "react";
import { ChevronDown, BadgeCheck, X } from "lucide-react";
import { TOKEN_LIST, type Token } from "@/lib/contracts";

export function TokenSelect({
  selected,
  onSelect,
  disabledSymbol,
}: {
  selected: Token;
  onSelect: (t: Token) => void;
  disabledSymbol?: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg
                   bg-ritual-bg border border-ritual-border
                   hover:border-ritual-accent transition"
      >
        <span className="text-lg">{selected.logo}</span>
        <span className="font-semibold">{selected.symbol}</span>
        {selected.verified && (
          <BadgeCheck size={14} className="text-ritual-verified" />
        )}
        <ChevronDown size={14} className="text-ritual-muted" />
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center
                     bg-black/70 backdrop-blur-sm p-4"
          onClick={() => setOpen(false)}
        >
          <div
            className="w-full max-w-sm rounded-xl border border-ritual-border
                       bg-ritual-surface p-4 space-y-3"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <h3 className="font-mono">select token</h3>
              <button onClick={() => setOpen(false)}
                className="text-ritual-muted hover:text-ritual-fg">
                <X size={18} />
              </button>
            </div>

            <div className="space-y-1">
              {TOKEN_LIST.map((t) => {
                const isDisabled = t.symbol === disabledSymbol;
                return (
                  <button
                    key={t.symbol}
                    disabled={isDisabled}
                    onClick={() => { onSelect(t); setOpen(false); }}
                    className="w-full flex items-center gap-3 p-3 rounded-lg
                               hover:bg-ritual-bg disabled:opacity-30
                               disabled:cursor-not-allowed transition text-left"
                  >
                    <span className="text-2xl">{t.logo}</span>
                    <div className="flex-1">
                      <div className="flex items-center gap-1.5">
                        <span className="font-semibold">{t.symbol}</span>
                        {t.verified && (
                          <BadgeCheck size={14} className="text-ritual-verified" />
                        )}
                      </div>
                      <div className="text-xs text-ritual-muted">{t.name}</div>
                    </div>
                    {t.address !== "0x0000000000000000000000000000000000000000" && (
                      <code className="text-[10px] text-ritual-muted">
                        {t.address.slice(0, 6)}…{t.address.slice(-4)}
                      </code>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
}