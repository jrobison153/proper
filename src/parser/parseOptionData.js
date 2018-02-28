/* eslint-disable no-use-before-define */
import fs from 'fs';
import parse from 'csv-parse';

export default (dataFile) => {

  return new Promise((resolve, reject) => {

    const parser = parse({
      delimiter: ',',
      skip_empty_lines: true,
    });
    const optionData = {
      calls: [],
      puts: [],
    };

    let lineCount = 0;
    let columnHeaderMap = {};

    parser.on('readable', () => {

      const completeRecord = readWholeRecord(parser);

      if (lineCount === 0) {

        columnHeaderMap = processColumnHeaders(completeRecord);
      } else if (completeRecord.length > 0) {

        if (completeRecord[columnHeaderMap.markCall] !== '<empty>') {
          const callData = buildCallDataObject(completeRecord, columnHeaderMap);
          optionData.calls.push(callData);
        }

        if (completeRecord[columnHeaderMap.markPut] !== '<empty>') {
          const putData = buildPutDataObject(completeRecord, columnHeaderMap);
          optionData.puts.push(putData);
        }
      }

      lineCount += 1;
    });

    // Catch any error
    parser.on('error', (err) => {
      reject(err.message);
    });

    parser.on('finish', () => {
      resolve(optionData);
    });

    const input = fs.createReadStream(dataFile);
    input.pipe(parser);
  });
};

const buildCallDataObject = (completeRecord, columnHeaderMap) => {

  return buildOptionDataObject(completeRecord, columnHeaderMap, 'Call');
};

const buildPutDataObject = (completeRecord, columnHeaderMap) => {

  return buildOptionDataObject(completeRecord, columnHeaderMap, 'Put');
};

const buildOptionDataObject = (completeRecord, columnHeaderMap, type) => {

  const probItmVal = completeRecord[columnHeaderMap[`probItm${type}`]];
  const openInterest = convertPossibleStringToBase10Number(completeRecord[columnHeaderMap[`openInterest${type}`]]);
  const volume = convertPossibleStringToBase10Number(completeRecord[columnHeaderMap[`volume${type}`]]);
  const mark = convertPossibleStringToFloat(completeRecord[columnHeaderMap[`mark${type}`]]);

  const optonData = {
    probItm: Number.parseFloat(probItmVal.substr(0, probItmVal.length - 1)),
    openInterest,
    volume,
    mark,
    expiration: completeRecord[columnHeaderMap.expiration],
    strike: parseFloat(completeRecord[columnHeaderMap.strike]),
  };

  return optonData;
};

const readWholeRecord = (parser) => {

  let record;
  let completeRecord = [];

  // eslint-disable-next-line no-cond-assign
  while (record = parser.read()) {
    completeRecord = completeRecord.concat(record);
  }

  return completeRecord;
};

const processColumnHeaders = (completeRecord) => {

  const columnHeaderMap = {};

  columnHeaderMap.probItmCall = completeRecord.indexOf('Prob.ITM');
  columnHeaderMap.probItmPut = completeRecord.lastIndexOf('Prob.ITM');

  columnHeaderMap.openInterestCall = completeRecord.indexOf('Open.Int');
  columnHeaderMap.openInterestPut = completeRecord.lastIndexOf('Open.Int');

  columnHeaderMap.volumeCall = completeRecord.indexOf('Volume');
  columnHeaderMap.volumePut = completeRecord.lastIndexOf('Volume');

  columnHeaderMap.markCall = completeRecord.indexOf('Mark');
  columnHeaderMap.markPut = completeRecord.lastIndexOf('Mark');

  columnHeaderMap.expiration = completeRecord.indexOf('Exp');

  columnHeaderMap.strike = completeRecord.indexOf('Strike');

  return columnHeaderMap;
};

const convertPossibleStringToBase10Number = (numberPossiblyAsString) => {

  let numberAsStringNoCommas = numberPossiblyAsString;

  if (typeof numberPossiblyAsString === 'string') {

    numberAsStringNoCommas = numberPossiblyAsString.replace(',', '');
  }

  const theNumber = Number.parseInt(numberAsStringNoCommas, 10);

  return theNumber;
};

const convertPossibleStringToFloat = (floatPossiblyAsString) => {

  let floatAsStringNoCommas = floatPossiblyAsString;

  if (typeof floatPossiblyAsString === 'string') {

    floatAsStringNoCommas = floatPossiblyAsString.replace(',', '');
  }

  let theNumber = Number.parseFloat(floatAsStringNoCommas);

  return theNumber;

};
