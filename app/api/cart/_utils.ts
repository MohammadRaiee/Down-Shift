import { NextResponse } from "next/server";

export function jsonError(code: string, message: string, status: number) {
  return NextResponse.json({ error: true, code, message }, { status });
}

export function isPositiveInt(value: unknown) {
  return Number.isInteger(value) && (value as number) > 0;
}

function stableStringify(value: unknown): string {
  if (value === null || value === undefined) {
    return "null";
  }

  if (Array.isArray(value)) {
    const items = value.map((item) => stableStringify(item));
    return `[${items.join(",")}]`;
  }

  if (typeof value === "object") {
    const obj = value as Record<string, unknown>;
    const keys = Object.keys(obj).sort();
    const entries = keys.map((key) => `${JSON.stringify(key)}:${stableStringify(obj[key])}`);
    return `{${entries.join(",")}}`;
  }

  return JSON.stringify(value);
}

export function buildItemKey(partId: number, options: unknown) {
  const normalized = stableStringify(options ?? {});
  return `${partId}:${normalized}`;
}
