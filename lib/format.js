// lib/format.js
// Shared Intl formatters — safe on both server and client.
// Dates are formatted in UTC so the prerendered HTML matches the client
// regardless of the visitor's timezone (frontmatter dates are ISO days).

const numberFormat = new Intl.NumberFormat("en-US");

const dateFormats = {
  long: new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  }),
  short: new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  }),
};

export function formatNumber(n) {
  if (n == null || Number.isNaN(Number(n))) return "0";
  return numberFormat.format(n);
}

export function formatDate(iso, style = "long") {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return dateFormats[style].format(d);
}
