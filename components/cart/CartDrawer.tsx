"use client";

import { useEffect, useState } from "react";
import {
  readGuestCart,
  removeGuestCartItem,
  updateGuestCartItem,
} from "@/lib/guestCart";
import { } from "@/lib/guestCart"; // This line is just to maintain the structure

export type CartItem = {
  id?: number;
  partId: number;
  quantity: number;
  priceAtAdd: number;
  options: unknown;
};

type CartDrawerProps = {
  open: boolean;
  onClose: () => void;
};

export default function CartDrawer({ open, onClose }: CartDrawerProps) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [source, setSource] = useState<"server" | "guest">("guest");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadCart = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/cart", { method: "GET" });
      if (response.ok) {
        const payload = await response.json();
        setSource("server");
        setItems(Array.isArray(payload.items) ? payload.items : []);
        return;
      }

      if (response.status === 401) {
        setSource("guest");
        setItems(readGuestCart());
        return;
      }

      setError("Unable to load cart.");
    } catch {
      setError("Unable to load cart.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) {
      loadCart();
    }
  }, [open]);

  const updateQuantity = async (item: CartItem, nextQuantity: number) => {
    if (nextQuantity < 1) {
      await removeItem(item);
      return;
    }

    if (source === "guest") {
      updateGuestCartItem(item.partId, item.options, nextQuantity);
      setItems(readGuestCart());
      return;
    }

    if (!item.id) {
      return;
    }

    try {
      const response = await fetch(`/api/cart/items/${item.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quantity: nextQuantity }),
      });

      if (response.ok) {
        setItems((current) =>
          current.map((entry) =>
            entry.id === item.id ? { ...entry, quantity: nextQuantity } : entry
          )
        );
      }
    } catch {
      // Ignore network errors for now.
    }
  };

  const removeItem = async (item: CartItem) => {
    if (source === "guest") {
      removeGuestCartItem(item.partId, item.options);
      setItems(readGuestCart());
      return;
    }

    if (!item.id) {
      return;
    }

    try {
      const response = await fetch(`/api/cart/items/${item.id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setItems((current) => current.filter((entry) => entry.id !== item.id));
      }
    } catch {
      // Ignore network errors for now.
    }
  };

  const total = items.reduce(
    (sum, item) => sum + item.priceAtAdd * item.quantity,
    0
  );

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50">
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />
      <aside className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-white text-slate-900 shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <h2 className="text-lg font-semibold">Cart</h2>
          <button
            type="button"
            onClick={onClose}
            className="text-sm text-slate-500 hover:text-slate-700"
          >
            Close
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4">
          {loading && <p className="text-sm text-slate-500">Loading...</p>}
          {!loading && error && (
            <p className="text-sm text-red-600">{error}</p>
          )}
          {!loading && !error && items.length === 0 && (
            <p className="text-sm text-slate-500">Your cart is empty.</p>
          )}

          <div className="space-y-4">
            {items.map((item) => (
              <div
                key={`${item.partId}-${item.id ?? "guest"}`}
                className="rounded-lg border border-slate-200 p-3"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold">Part #{item.partId}</p>
                    <p className="text-xs text-slate-500">
                      Price: {item.priceAtAdd.toLocaleString()}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeItem(item)}
                    className="text-xs text-red-500 hover:text-red-600"
                  >
                    Remove
                  </button>
                </div>

                <div className="mt-3 flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => updateQuantity(item, item.quantity - 1)}
                    className="flex h-7 w-7 items-center justify-center rounded-full border border-slate-300 text-sm"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    min={1}
                    value={item.quantity}
                    onChange={(event) =>
                      updateQuantity(item, Number(event.target.value))
                    }
                    className="h-7 w-16 rounded-md border border-slate-300 text-center text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => updateQuantity(item, item.quantity + 1)}
                    className="flex h-7 w-7 items-center justify-center rounded-full border border-slate-300 text-sm"
                  >
                    +
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t border-slate-200 px-5 py-4">
          <div className="flex items-center justify-between text-sm font-semibold">
            <span>Total</span>
            <span>{total.toLocaleString()}</span>
          </div>
          {source === "guest" && items.length > 0 && (
            <p className="mt-2 text-xs text-slate-500">
              Sign in to save your cart across devices.
            </p>
          )}
        </div>
      </aside>
    </div>
  );
}
