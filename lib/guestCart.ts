export type GuestCartItem = {
  partId: number;
  quantity: number;
  priceAtAdd: number;
  options: unknown;
};

const STORAGE_KEY = "guest_cart_items";

export function readGuestCart(): GuestCartItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const items = raw ? (JSON.parse(raw) as GuestCartItem[]) : [];
    return Array.isArray(items) ? items : [];
  } catch {
    return [];
  }
}

export function writeGuestCart(items: GuestCartItem[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

export function clearGuestCart(): void {
  localStorage.removeItem(STORAGE_KEY);
}

export function addToGuestCart(part: { id: number; price: number }, options: unknown = null): void {
  const items = readGuestCart();
  const existing = items.find((item) => item.partId === part.id && item.options === options);

  if (existing) {
    existing.quantity += 1;
  } else {
    items.push({ partId: part.id, quantity: 1, priceAtAdd: part.price, options });
  }

  writeGuestCart(items);
}

export function updateGuestCartItem(partId: number, options: unknown, quantity: number): void {
  const items = readGuestCart();
  const target = items.find((item) => item.partId === partId && item.options === options);

  if (!target) {
    return;
  }

  target.quantity = quantity;
  writeGuestCart(items);
}

export function removeGuestCartItem(partId: number, options: unknown): void {
  const items = readGuestCart();
  const filtered = items.filter((item) => !(item.partId === partId && item.options === options));
  writeGuestCart(filtered);
}
