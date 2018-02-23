/* eslint-disable no-use-before-define */

export default (optionData, verticalCreditSpreadFinderead) => {

  return verticalCreditSpreadFinderead(optionData, isCreditPotentialStrikes);
};

const isCreditPotentialStrikes = (shortStrike, longStrike) => {

  return longStrike.strike < shortStrike.strike;
};
