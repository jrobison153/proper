/* eslint-disable no-use-before-define */

export default (optionData, verticalCallSpreadFinder) => {

  return verticalCallSpreadFinder(optionData, isCreditPotentialStrikes);
};

const isCreditPotentialStrikes = (shortStrike, longStrike) => {

  return longStrike.strike > shortStrike.strike;
};
