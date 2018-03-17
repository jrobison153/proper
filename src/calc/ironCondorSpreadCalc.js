/* eslint-disable no-use-before-define */

export const filterValidIronCondors = (anchorSpread, testSpreads) => {

  const validIronCondors = testSpreads.filter((testSpread) => {

    const cost = calculateFairAndEquitableCost(anchorSpread, testSpread);

    return (testSpread.credit + anchorSpread.credit) >= cost;
  });

  return validIronCondors;
};

export const calculateFairAndEquitableCost = (callSpread, putSpread) => {

  const faeCost = callSpread.fairAndEquitableCost + putSpread.fairAndEquitableCost;

  return parseFloat(faeCost.toFixed(2));
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
