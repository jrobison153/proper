import { expect } from 'chai';
import parseOptionData from '../../../src/parser/parseOptionData';

describe('parseOptionData Tests', () => {

  describe('given CSV file with Call and Put data', () => {

    describe('when parsed', () => {

      let optionData;

      before(async () => {

        const dataFile = require.resolve('./data/parserInput.csv');
        optionData = await parseOptionData(dataFile);
      });

      it('parses out all the calls', () => {

        expect(optionData.calls).to.have.lengthOf(3);
      });

      it('parses out all the puts', () => {

        expect(optionData.puts).to.have.lengthOf(3);
      });

      it('parses the Probability of ITM for each CALL w/o % symbol', () => {

        expect(optionData.calls[0].probItm).to.equal(99.06);
        expect(optionData.calls[1].probItm).to.equal(99.84);
        expect(optionData.calls[2].probItm).to.equal(99.45);
      });

      it('parses the Probability of ITM for each PUT w/o % symbol', () => {

        expect(optionData.puts[0].probItm).to.equal(1.96);
        expect(optionData.puts[1].probItm).to.equal(0.99);
        expect(optionData.puts[2].probItm).to.equal(2.27);
      });

      it('parses the Open Interest for each CALL', () => {

        expect(optionData.calls[0].openInterest).to.equal(10);
        expect(optionData.calls[1].openInterest).to.equal(20);
        expect(optionData.calls[2].openInterest).to.equal(30);
      });

      it('parses the Open Interest for each PUT', () => {

        expect(optionData.puts[0].openInterest).to.equal(27);
        expect(optionData.puts[1].openInterest).to.equal(10);
        expect(optionData.puts[2].openInterest).to.equal(84);
      });

      it('parses the Volume for each CALL', () => {

        expect(optionData.calls[0].volume).to.equal(100);
        expect(optionData.calls[1].volume).to.equal(200);
        expect(optionData.calls[2].volume).to.equal(300);
      });

      it('parses the Volume for each PUT', () => {

        expect(optionData.puts[0].volume).to.equal(10);
        expect(optionData.puts[1].volume).to.equal(40);
        expect(optionData.puts[2].volume).to.equal(70);
      });

      it('parses the Mark for each CALL', () => {

        expect(optionData.calls[0].mark).to.equal(135.900);
        expect(optionData.calls[1].mark).to.equal(130.800);
        expect(optionData.calls[2].mark).to.equal(125.850);
      });

      it('parses the Mark for each PUT', () => {

        expect(optionData.puts[0].mark).to.equal(0.300);
        expect(optionData.puts[1].mark).to.equal(0.125);
        expect(optionData.puts[2].mark).to.equal(0.350);
      });

      it('parses the Expiration Date for each CALL', () => {

        expect(optionData.calls[0].expiration).to.equal('16 MAR 18');
        expect(optionData.calls[1].expiration).to.equal('16 MAR 18');
        expect(optionData.calls[2].expiration).to.equal('16 MAR 18');
      });

      it('parses the Expiration Date for each PUT', () => {

        expect(optionData.puts[0].expiration).to.equal('16 MAR 18');
        expect(optionData.puts[1].expiration).to.equal('16 MAR 18');
        expect(optionData.puts[2].expiration).to.equal('16 MAR 18');
      });

      it('parses the Strike for each CALL', () => {

        expect(optionData.calls[0].strike).to.equal(170.0);
        expect(optionData.calls[1].strike).to.equal(175.0);
        expect(optionData.calls[2].strike).to.equal(180.0);
      });

      it('parses the Strike for each PUT', () => {

        expect(optionData.puts[0].strike).to.equal(170.0);
        expect(optionData.puts[1].strike).to.equal(175.0);
        expect(optionData.puts[2].strike).to.equal(180.0);
      });
    });
  });

  describe('given csv file with <empty> fields', () => {

    describe('when parsed', () => {

      it('discards the any with an <empty> Mark', async () => {
        const dataFileWithEmptyFields = require.resolve('./data/dataWithEmptyFields.csv');
        const optionData = await parseOptionData(dataFileWithEmptyFields);

        expect(optionData.calls).to.have.lengthOf(3);
        expect(optionData.puts).to.have.lengthOf(3);
      });
    });
  });
});
