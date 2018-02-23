/* eslint-disable no-use-before-define */
import parseOptionData from './parser/parseOptionData';
import bullPutSpreadFinder from './strategies/bullPutSpreadFinder';
import bearCallSpreadFinder from './strategies/bearCallSpreadFinder';
import verticalCreditSpreadFinder from './strategies/verticalCreditSpreadFinder';

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

    const bullPutSpreads = bullPutSpreadFinder(optionData.puts, verticalCreditSpreadFinder);
    const bearCallSpreads = bearCallSpreadFinder(optionData.calls, verticalCreditSpreadFinder);

    printCreditSpreads(bullPutSpreads, cliui, 'Bull Put Spread');
    printCreditSpreads(bearCallSpreads, cliui, 'Bear Call Spread');

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
