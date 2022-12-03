export const convertPricePerDay = (
  price: number,
  duration: number,
  numberOfDecimals = 8
) => {
  const numberDays = duration / 86400;
  if (!price || !numberDays) return 0;
  const priceDay = price / numberDays;

  if (Number.isInteger(priceDay)) return priceDay;
  return Number(priceDay.toFixed(numberOfDecimals));
};
