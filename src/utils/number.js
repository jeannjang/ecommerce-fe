export const CURRENCY_TYPES = {
  NZD: {
    symbol: "$",
    locale: "en-NZ",
    precision: 2,
  },
};

/**
 * Formats a number into a currency string
 * @param {number} value - The number to format
 * @returns {string} Formatted currency string
 */
export const currencyFormat = (value) => {
  const number = value !== undefined ? value : 0;
  const currency = CURRENCY_TYPES.NZD;

  return new Intl.NumberFormat(currency.locale, {
    style: "currency",
    currency: "NZD",
    minimumFractionDigits: currency.precision,
    maximumFractionDigits: currency.precision,
  }).format(number);
};

export const cc_expires_format = (string) => {
  return string
    .replace(
      /[^0-9]/g,
      "" // To allow only numbers
    )
    .replace(
      /^([2-9])$/g,
      "0$1" // To handle 3 > 03
    )
    .replace(
      /^(1{1})([3-9]{1})$/g,
      "0$1/$2" // 13 > 01/3
    )
    .replace(
      /^0{1,}/g,
      "0" // To handle 00 > 0
    )
    .replace(
      /^([0-1]{1}[0-9]{1})([0-9]{1,2}).*/g,
      "$1/$2" // To handle 113 > 11/3
    );
};
