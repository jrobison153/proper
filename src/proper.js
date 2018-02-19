
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
  );

  const optionData = parseOptionData(dataFile);

  cliui.div();
  cliui.div();
};
