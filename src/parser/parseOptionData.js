import fs from 'fs';
import parse from 'csv-parse';

export default (dataFile) => {

  const parser = parse({ delimiter: ',' });
  const optionData = { calls: [] };

  // Use the writable stream api
  parser.on('readable', () => {

    let record;
    while (record = parser.read()) {

      optionData.calls.push(record);
    }
  });

  // Catch any error
  parser.on('error', (err) => {
    console.log(err.message);
  });

  parser.on('finish', () => {
    donePromise.resolve(optionData);
  });

  const input = fs.createReadStream(dataFile);
  input.pipe(parser);

  return optionData;
};
