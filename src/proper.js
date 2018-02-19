import parseOptionData from './parser/parseOptionData';
import bullPutSpreadFinder from './strategies/bullPutSpreadFinder';

export default (cliui, dataFile) => {

  cliui.div(
    {
      text: 'Strategy',
    },
    {
      text: 'Credit/Debit',
    },
    {
      text: 'FaE Cost',
    },
    {
      text: 'FaE Cost Ratio',
    },
    {
      text: 'Expiration',
    },
    {
      text: 'Strikes',
    },
  );

  const optionData = parseOptionData(dataFile);

  const bullPutSpreads = bullPutSpreadFinder(optionData);

  bullPutSpreads.forEach((bullPutSpread) => {

    cliui.div(
      {
        text: 'Bull Put Spread',
      },
      {
        text: bullPutSpread.creditOrDebit,
      },
      {
        text: bullPutSpread.fairAndEquitableValue,
      },
      {
        text: bullPutSpread.fairAndEquitableRatio,
      },
      {
        text: bullPutSpread.expiration,
      },
      {
        text: bullPutSpread.strikes,
      },
    );
  });
};
