import { storeConfig } from "@/lib/config";

/** Formats an amount in minor units (cents) as a currency string. */
export function formatMoney(cents: number, currency: string = storeConfig.currency, locale: string = storeConfig.locale) {
  return new Intl.NumberFormat(locale, { style: "currency", currency }).format(cents / 100);
}
