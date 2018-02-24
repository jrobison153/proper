/* eslint-disable no-use-before-define */
import {
  isFairAndEquitable, fairAndEquitableCost, calculateCredit,
  isExpiringInSameMonth, calculateFairAndEquitableRatio,
} from '../calc/verticalSpreadCheck';

const MIN_PROBABILITY_ITM = 27.00;
const MAX_PROBABILITY_ITM = 34.00;

export default (options) => {

  return (optionData, isCreditPotentialStrikes) => {

    let minimumItmPercent = MIN_PROBABILITY_ITM;
    let maximumItmPercent = MAX_PROBABILITY_ITM;
    let skippingFaeCheck = false;

    if (options) {

      minimumItmPercent = options.minProbItmPercent || MIN_PROBABILITY_ITM;
      maximumItmPercent = options.maxProbItmPercent || MAX_PROBABILITY_ITM;
      skippingFaeCheck = options.skipFaECheck || false;
    }

    const anchorStrikeOptions = optionData.filter((option) => {

      return option.probItm > minimumItmPercent && option.probItm < maximumItmPercent;
    });

    let allFormattedSpreads = [];
    if (anchorStrikeOptions.length > 0) {

      anchorStrikeOptions.forEach((shortStrikeOption) => {

        const spreads =
          findSpreadsFromAnchor(shortStrikeOption, optionData, isCreditPotentialStrikes, skippingFaeCheck);

        const formattedSpreads = spreads.map((longStrikeOption) => {

          const credit = calculateCredit(shortStrikeOption, longStrikeOption);
          const risk = Math.abs(shortStrikeOption.strike - longStrikeOption.strike);
          return {
            anchorStrikeProbItm: shortStrikeOption.probItm,
            credit,
            expiration: shortStrikeOption.expiration,
            fairAndEquitableCost: fairAndEquitableCost(shortStrikeOption, longStrikeOption),
            fairAndEquitableRatio: calculateFairAndEquitableRatio(shortStrikeOption, longStrikeOption),
            rewardRiskRatio: parseFloat((credit / risk).toFixed(2)),
            risk,
            strikes: `${shortStrikeOption.strike}/${longStrikeOption.strike}`,
            strikeWidth: Math.abs(shortStrikeOption.strike - longStrikeOption.strike),
          };
        });

        allFormattedSpreads = [...allFormattedSpreads, ...formattedSpreads];
      });
    }

    return allFormattedSpreads;
  };
};

const findSpreadsFromAnchor = (shortStrike, optionData, isCreditPotentialStrikes, isSkippingFaECheck) => {

  let allBullPutSpreads = [];

  const validLongStrikes = optionData.filter((longStrike) => {

    return isCreditPotentialStrikes(shortStrike, longStrike)
      && (isSkippingFaECheck || isFairAndEquitable(shortStrike, longStrike))
      && isExpiringInSameMonth(shortStrike, longStrike);
  });

  validLongStrikes.forEach((longStrike) => {

    allBullPutSpreads = allBullPutSpreads.concat(longStrike);
  });

  return allBullPutSpreads;
};
