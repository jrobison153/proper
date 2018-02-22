import parseOptionData from './parser/parseOptionData';
import bullPutSpreadFinder from './strategies/bullPutSpreadFinder';

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

    const bullPutSpreads = bullPutSpreadFinder(optionData.puts);

    bullPutSpreads.forEach((bullPutSpread) => {

      cliui.div(
        {
          text: 'Bull Put Spread',
          width: COLUMN_WIDTH,
        },
        {
          text: bullPutSpread.credit.toString(),
          width: COLUMN_WIDTH,
        },
        {
          text: bullPutSpread.fairAndEquitableCost.toString(),
          width: COLUMN_WIDTH,
        },
        {
          text: bullPutSpread.fairAndEquitableRatio.toString(),
          width: COLUMN_WIDTH,
        },
        {
          text: bullPutSpread.expiration,
          width: COLUMN_WIDTH,
        },
        {
          text: bullPutSpread.strikes,
          width: COLUMN_WIDTH,
        },
      );
    });

    cliui.div('');
    console.log(cliui.toString());
  } catch (e) {

    console.error(e);
    throw e;
  }
};
