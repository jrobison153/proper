/* eslint-disable no-use-before-define */
import {
  isFairAndEquitable, fairAndEquitableCost, calculateCredit,
  isExpiringInSameMonth, calculateFairAndEquitableRatio,
} from '../calc/verticalSpreadCheck';

const MIN_PROBABILITY_ITM = 27.00;
const MAX_PROBABILITY_ITM = 34.00;

export default (optionData, isCreditPotentialStrikes) => {

  const anchorStrikeOptions = optionData.filter((option) => {

    return option.probItm > MIN_PROBABILITY_ITM && option.probItm < MAX_PROBABILITY_ITM;
  });

  let allFormattedSpreads = [];
  if (anchorStrikeOptions.length > 0) {

    anchorStrikeOptions.forEach((shortStrike) => {

      const spreads = findSpreadsFromAnchor(shortStrike, optionData, isCreditPotentialStrikes);

      const formattedSpreads = spreads.map((longSpreadStrike) => {

        return {
          credit: calculateCredit(shortStrike, longSpreadStrike),
          expiration: shortStrike.expiration,
          fairAndEquitableCost: fairAndEquitableCost(shortStrike, longSpreadStrike),
          fairAndEquitableRatio: calculateFairAndEquitableRatio(shortStrike, longSpreadStrike),
          strikes: `${shortStrike.strike}/${longSpreadStrike.strike}`,
        };
      });

      allFormattedSpreads = [...allFormattedSpreads, ...formattedSpreads];
    });
  }

  return allFormattedSpreads;
};

const findSpreadsFromAnchor = (shortStrike, optionData, isCreditPotentialStrikes) => {

  let allBullPutSpreads = [];

  const validLongStrikes = optionData.filter((longStrike) => {

    return isCreditPotentialStrikes(shortStrike, longStrike)
      && isFairAndEquitable(shortStrike, longStrike)
      && isExpiringInSameMonth(shortStrike, longStrike);
  });

  validLongStrikes.forEach((longStrike) => {

    allBullPutSpreads = allBullPutSpreads.concat(longStrike);
  });

  return allBullPutSpreads;
};
