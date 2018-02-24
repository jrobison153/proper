/* eslint-disable no-use-before-define */

export const filterValidIronCondors = (anchorSpread, testSpreads) => {

  const validIronCondors = testSpreads.filter((testSpread) => {

    const cost = calculateFairAndEquitableCost(anchorSpread, testSpread);

    return (testSpread.credit + anchorSpread.credit) >= cost;
  });

  return validIronCondors;
};

export const calculateFairAndEquitableCost = (callSpread, putSpread) => {

  let cost;

  if (callSpread.fairAndEquitableCost > putSpread.fairAndEquitableCost) {

    cost = callSpread.fairAndEquitableCost;
  } else {

    cost = putSpread.fairAndEquitableCost;
  }

  return cost;
};

export const calculateMaxRisk = (callSpread, putSpread) => {

  let maxRisk;

  if (callSpread.risk > putSpread.risk) {

    maxRisk = callSpread.risk;
  } else {

    maxRisk = putSpread.risk;
  }

  return maxRisk;
};