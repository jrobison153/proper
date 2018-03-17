/* eslint-disable no-use-before-define */
import arraySort from 'array-sort';

import parseOptionData from './parser/parseOptionData';
import bullPutSpreadFinder from './strategies/bullPutSpreadFinder';
import bearCallSpreadFinder from './strategies/bearCallSpreadFinder';
import verticalCreditSpreadFinder from './strategies/verticalCreditSpreadFinder';
import ironCondorFinder from './strategies/ironCondorFinder';

const COLUMN_WIDTH = 20;

export default async (cliui, dataFile) => {

  cliui.div(
    {
      text: 'Strategy',
      width: COLUMN_WIDTH,
    },
    {
      text: 'Credit/Debit',
      width: COLUMN_WIDTH,
    },
    {
      text: 'Risk',
      width: COLUMN_WIDTH,
    },
    {
      text: 'Reward/Risk Ratio',
      width: COLUMN_WIDTH,
    },
    {
      text: 'FaE Cost',
      width: COLUMN_WIDTH,
    },
    {
      text: 'FaE Cost Ratio',
      width: COLUMN_WIDTH,
    },
    {
      text: 'Expiration',
      width: COLUMN_WIDTH,
    },
    {
      text: 'Strikes',
      width: COLUMN_WIDTH,
    },
  );

  try {

    const optionData = await parseOptionData(dataFile);

    let bullPutSpreads = bullPutSpreadFinder(optionData.puts, verticalCreditSpreadFinder());
    let bearCallSpreads = bearCallSpreadFinder(optionData.calls, verticalCreditSpreadFinder());
    let fullCreditIronCondors =
      ironCondorFinder(optionData, bearCallSpreadFinder, bullPutSpreadFinder, verticalCreditSpreadFinder);
    let ironCondors = ironCondorFinder(
      optionData,
      bearCallSpreadFinder,
      bullPutSpreadFinder,
      verticalCreditSpreadFinder,
      { isNormalIronCondor: true },
    );

    bullPutSpreads = arraySort(bullPutSpreads, 'rewardRiskRatio', { reverse: true });
    bearCallSpreads = arraySort(bearCallSpreads, 'rewardRiskRatio', { reverse: true });
    fullCreditIronCondors = arraySort(fullCreditIronCondors, 'rewardRiskRatio', { reverse: true });
    ironCondors = arraySort(ironCondors, 'rewardRiskRatio', { reverse: true });

    printCreditSpreads(bullPutSpreads, cliui, 'Bull Put Spread');
    printCreditSpreads(bearCallSpreads, cliui, 'Bear Call Spread');
    printCreditSpreads(ironCondors, cliui, 'Iron Condor');
    printCreditSpreads(fullCreditIronCondors, cliui, 'Full Credit Iron Condor');

    // eslint-disable-next-line no-console
    console.log(cliui.toString());
  } catch (e) {

    console.error(`Something went wrong ${e.message}`);
    throw e;
  }
};

const printCreditSpreads = (spreads, cliui, type) => {

  spreads.forEach((spread) => {

    cliui.div(
      {
        text: type,
        width: COLUMN_WIDTH,
      },
      {
        text: spread.credit.toString(),
        width: COLUMN_WIDTH,
      },
      {
        text: spread.risk.toString(),
        width: COLUMN_WIDTH,
      },
      {
        text: spread.rewardRiskRatio.toString(),
        width: COLUMN_WIDTH,
      },
      {
        text: spread.fairAndEquitableCost.toString(),
        width: COLUMN_WIDTH,
      },
      {
        text: spread.fairAndEquitableRatio.toString(),
        width: COLUMN_WIDTH,
      },
      {
        text: spread.expiration,
        width: COLUMN_WIDTH,
      },
      {
        text: spread.strikes,
        width: COLUMN_WIDTH,
      },
    );
  });
};
