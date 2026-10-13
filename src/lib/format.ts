// src/lib/format.ts
// Utility functions for Indian number formatting and friendly dates.

/**
 * Format a number as Indian currency (₹1,50,000)
 */
export function formatIndianCurrency(amount: number): string {
  if (amount === 0) return "Free";
  return "₹" + amount.toLocaleString("en-IN");
}

/**
 * Format an ISO date string as "Sat, 18 Oct, 6:30 PM"
 */
export function formatFriendlyDate(isoDate: string): string {
  const d = new Date(isoDate);
  return d.toLocaleString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZone: "Asia/Kolkata",
  });
}

/**
 * Return true if the event's date_time is in the future
 */
export function isUpcoming(dateTime: string): boolean {
  return new Date(dateTime) > new Date();
}
