/* eslint-disable no-use-before-define */

export const isFairAndEquitable = (shortStrikeOption, longStrikeOption) => {

  const cost = fairAndEquitableCost(shortStrikeOption, longStrikeOption);
  const creditTakenOnSale = calculateCredit(shortStrikeOption, longStrikeOption);

  return cost <= creditTakenOnSale;
};

export const fairAndEquitableCost = (shortStrikeOption, longStrikeOption) => {

  const widthOfStrikes = shortStrikeOption.strike - longStrikeOption.strike;
  const cost = widthOfStrikes * (shortStrikeOption.probItm / 100);

  const formattedCost = parseFloat(cost.toFixed(2));
  const absFormattedCost = Math.abs(formattedCost);

  return absFormattedCost;
};

export const calculateCredit = (shortStrikeOption, longStrikeOption) => {

  return parseFloat((shortStrikeOption.mark - longStrikeOption.mark).toFixed(2));
};

export const calculateFairAndEquitableRatio = (shortStrikeOption, longStrikeOption) => {

  const cost = fairAndEquitableCost(shortStrikeOption, longStrikeOption);
  const credit = calculateCredit(shortStrikeOption, longStrikeOption);

  return parseFloat((credit / cost).toFixed(2));
};

export const isExpiringInSameMonth = (shortStrikeOption, longStrikeOption) => {

  return longStrikeOption.expiration === shortStrikeOption.expiration;
};
