/* eslint-disable no-use-before-define */

export default (optionData, configuredVerticalCreditSpreadFinder) => {

  return configuredVerticalCreditSpreadFinder(optionData, isCreditPotentialStrikes);
};

const isCreditPotentialStrikes = (shortStrike, longStrike) => {

  return longStrike.strike < shortStrike.strike;
};
