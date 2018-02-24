/* eslint-disable no-use-before-define */

import { calculateFairAndEquitableCost, calculateMaxRisk, filterValidIronCondors } from '../calc/ironCondorSpreadCalc';

export default (
  optionData,
  bearCallCreditSpreadFinder,
  bullPutCreditSpreadFinder,
  verticalCreditSpreadFinder,
  options,
) => {

  const spreadCalcConfigOptions = {
    minProbItmPercent: 13.00,
    maxProbItmPercent: 17.00,
    skipFaECheck: !!(options && options.isNormalIronCondor),
  };

  const configuredVerticalCreditSpreadFinder = verticalCreditSpreadFinder(spreadCalcConfigOptions);

  const callSideSpreads = bearCallCreditSpreadFinder(optionData.calls, configuredVerticalCreditSpreadFinder);
  const putSideSpreads = bullPutCreditSpreadFinder(optionData.puts, configuredVerticalCreditSpreadFinder);

  let allIronCondors = [];

  callSideSpreads.forEach((callSpread) => {

    const ironCondorsForCall = filterValidIronCondors(callSpread, putSideSpreads);

    ironCondorsForCall.forEach((putSpread) => {

      const faeCost = calculateFairAndEquitableCost(callSpread, putSpread);
      const totalCredit = callSpread.credit + putSpread.credit;
      const totalRisk = calculateMaxRisk(callSpread, putSpread);

      const ironCondor = {
        credit: totalCredit,
        expiration: callSpread.expiration,
        fairAndEquitableCost: faeCost,
        fairAndEquitableRatio: parseFloat((totalCredit / faeCost).toFixed(2)),
        rewardRiskRatio: parseFloat((totalCredit / totalRisk).toFixed(2)),
        risk: totalRisk,
        strikes: `${callSpread.strikes}/${putSpread.strikes}`,
      };

      allIronCondors = [...allIronCondors, ironCondor];
    });
  });

  return allIronCondors;
};

