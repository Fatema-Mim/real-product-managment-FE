export const capitalizeFirst = (text: string): string => {
  if (!text) return "";
  return text.charAt(0).toUpperCase() + text.slice(1);
};

export const truncateText = (text: string, maxLength: number): string => {
  if (!text || text.length <= maxLength) return text;
  return `${text.slice(0, maxLength)}...`;
};

export const formatCurrency = (amount: number, currency: string = "৳"): string => {
  return `${currency}${amount.toFixed(2)}`;
};
