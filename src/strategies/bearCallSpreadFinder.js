/* eslint-disable no-use-before-define */

export default (optionData, configuredVerticalCallSpreadFinder) => {

  return configuredVerticalCallSpreadFinder(optionData, isCreditPotentialStrikes);
};

const isCreditPotentialStrikes = (shortStrike, longStrike) => {

  return longStrike.strike > shortStrike.strike;
};
