import { currencies } from "@/constant/currensies";

export function DateToUTCDate(date: Date) {
  return new Date(
    Date.UTC(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      date.getHours(),
      date.getMinutes(),
      date.getSeconds(),
      date.getMilliseconds()
    )
  );
}

export function GetFormatterForCurrency(currency: string): Intl.NumberFormat {
  const currencyData = currencies.find((c) => c.value === currency);

  if (!currencyData) {
    throw new Error(`Currency "${currency}" is not supported.`);
  }

  return new Intl.NumberFormat(currencyData.locale, {
    style: "currency",
    currency,
  });
}
