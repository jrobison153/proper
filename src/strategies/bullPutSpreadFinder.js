/* eslint-disable no-use-before-define */
const MIN_PROBABILITY_ITM = 27.00;
const MAX_PROBABILITY_ITM = 34.00;

export default (optionData) => {

  const anchorStrikeOptions = optionData.filter((option) => {

    return option.probItm > MIN_PROBABILITY_ITM && option.probItm < MAX_PROBABILITY_ITM;
  });

  let allFormattedSpreads = [];
  if (anchorStrikeOptions.length > 0) {

    anchorStrikeOptions.forEach((shortStrike) => {

      const spreads = findSpreadsFromAnchor(shortStrike, optionData);

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

const isFairAndEquitable = (shortStrike, longStrike) => {

  const cost = fairAndEquitableCost(shortStrike, longStrike);
  const creditTakenOnSale = calculateCredit(shortStrike, longStrike);

  return cost <= creditTakenOnSale;
};

const fairAndEquitableCost = (shortStrike, longStrike) => {

  const widthOfStrikes = shortStrike.strike - longStrike.strike;
  const cost = widthOfStrikes * (shortStrike.probItm / 100);

  return parseFloat(cost.toFixed(2));
};

const calculateCredit = (shortStrike, longStrike) => {

  return parseFloat((shortStrike.mark - longStrike.mark).toFixed(2));
};

const findSpreadsFromAnchor = (shortStrike, optionData) => {

  let allBullPutSpreads = [];

  const validLongStrikes = optionData.filter((longStrike) => {

    return longStrike.strike < shortStrike.strike && isFairAndEquitable(shortStrike, longStrike);
  });

  validLongStrikes.forEach((longStrike) => {

    allBullPutSpreads = allBullPutSpreads.concat(longStrike);
  });

  return allBullPutSpreads;
};

const calculateFairAndEquitableRatio = (shortStrike, longStrike) => {

  const cost = fairAndEquitableCost(shortStrike, longStrike);
  const credit = calculateCredit(shortStrike, longStrike);

  return parseFloat((credit / cost).toFixed(2));
};
