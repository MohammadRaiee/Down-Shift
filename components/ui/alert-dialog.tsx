"use client";

import { useEffect } from "react";

type AlertDialogProps = {
  open: boolean;
  mainText: string;
  button1Text: string;
  button2Text: string;
  callbackFunction1: () => void;
  callbackFunction2: () => void;
};

export function AlertDialog({
  open,
  mainText,
  button1Text,
  button2Text,
  callbackFunction1,
  callbackFunction2,
}: AlertDialogProps) {
  useEffect(() => {
    if (!open) {
      return;
    }
console.log(mainText)
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        callbackFunction2();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [open, callbackFunction2]);

  if (!open) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4"
      role="dialog"
      aria-modal="true"
      aria-label="Alert dialog"
      onClick={callbackFunction2}
    >
      <div
        className="w-full max-w-md rounded-2xl border border-zinc-800 bg-zinc-950 p-6 shadow-[0_22px_55px_rgba(0,0,0,0.6)]"
        onClick={(event) => event.stopPropagation()}
      >
        <p className="text-sm uppercase tracking-[0.24em] text-red-400">Notice</p>
        <p className="mt-4 text-base leading-7 text-zinc-100">{mainText}</p>

        <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
     { button1Text && <button
            type="button"
            onClick={callbackFunction1}
            className="h-11 rounded-xl border border-zinc-700 bg-transparent px-4 text-sm font-semibold text-zinc-200 transition-colors hover:border-zinc-500 hover:bg-zinc-900"
          >
            {button1Text}
          </button>}
    { button2Text &&  <button
            type="button"
            onClick={callbackFunction2}
            className="h-11 rounded-xl bg-red-600 px-4 text-sm font-semibold text-white transition-all hover:bg-red-500 hover:shadow-[0_0_24px_rgba(220,38,38,0.35)]"
          >
            {button2Text}
          </button>}
        </div>
      </div>
    </div>
  );
}
