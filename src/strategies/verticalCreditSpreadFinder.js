/* eslint-disable no-use-before-define */
import {
  isFairAndEquitable, fairAndEquitableCost, calculateCredit,
  isExpiringInSameMonth, calculateFairAndEquitableRatio,
} from '../calc/verticalSpreadCheck';

const MIN_PROBABILITY_ITM = 23.00;
const MAX_PROBABILITY_ITM = 35.00;
const MIN_OPEN_INTEREST = 500;

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

      return option.probItm > minimumItmPercent
        && option.probItm < maximumItmPercent
        && option.openInterest >= MIN_OPEN_INTEREST;
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

    const hasCredit = isCreditPotentialStrikes(shortStrike, longStrike);
    const hasFairAndEquitableChance = (isSkippingFaECheck || isFairAndEquitable(shortStrike, longStrike));
    const optionsHaveSameExpiration = isExpiringInSameMonth(shortStrike, longStrike);
    const longStrikeHasEnoughOpenInterest = longStrike.openInterest >= MIN_OPEN_INTEREST;

    return hasCredit
      && hasFairAndEquitableChance
      && optionsHaveSameExpiration
      && longStrikeHasEnoughOpenInterest;
  });

  validLongStrikes.forEach((longStrike) => {

    allBullPutSpreads = allBullPutSpreads.concat(longStrike);
  });

  return allBullPutSpreads;
};
