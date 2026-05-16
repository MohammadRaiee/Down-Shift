import { readGuestCart, clearGuestCart } from "@/lib/guestCart";

export async function mergeGuestCartAfterLogin(): Promise<void> {
  const items = readGuestCart();
  if (!items.length) {
    return;
  }

  try {
    const response = await fetch("/api/cart/merge", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items }),
    });

    if (response.status === 403) {
      clearGuestCart();
      return;
    }

    if (!response.ok) {
      return;
    }

    clearGuestCart();
  } catch {
    // Ignore merge errors; keep guest cart for retry.
  }
}
