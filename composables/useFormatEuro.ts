export const useFormatEuro = (cents: number) => {
  return new Intl.NumberFormat("nl-BE", {
    style: "currency",
    currency: "EUR",
  }).format(cents / 100);
};
