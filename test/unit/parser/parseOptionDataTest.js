import { expect } from 'chai';
import parseOptionData from '../../../src/parser/parseOptionData';

describe('parseOptionData Tests', () => {

  describe('given CSV file with Call and Put data', () => {

    describe('when parsed', () => {

      it('parses out all the calls', () => {

        const dataFile = require.resolve('./data/parserInput.csv');
        const optionData = parseOptionData(dataFile);
        expect(optionData.calls).to.have.lengthOf(5);
      });
    });
  });
});