import { expect } from 'chai';
import proper from '../../src/proper';

describe('fileFeatures Tests', () => {

  describe('given a correctly formatted option data csv file', () => {

    describe('when scanned for fair and equitable trades', () => {

      it('prints each candidate out as a row in a table with correct headers', () => {

        const cliuiSpy = new CliUiSpy();

        proper(cliuiSpy);

        expect(cliuiSpy.divCallCount).to.equal(3);
        expect(cliuiSpy.row[0][0].text).to.equal('Strategy');
        expect(cliuiSpy.row[0][1].text).to.equal('Credit/Debit');
        expect(cliuiSpy.row[0][2].text).to.equal('FaE Cost');
        expect(cliuiSpy.row[0][3].text).to.equal('FaE Cost Ratio');
        expect(cliuiSpy.row[0][4].text).to.equal('Expiration');
        expect(cliuiSpy.row[0][5].text).to.equal('Strikes');
      });

      describe('and vertical PUT credit spreads found', () => {

        it('prints the fields in the correct columns', () => {

          const cliuiSpy = new CliUiSpy();
          const inputFile = require.resolve('./data/BPuSgoodData.csv');
          proper(cliuiSpy, inputFile);

          expect(cliuiSpy.row[1][0].text).to.equal('Bull Put Spread');
          expect(cliuiSpy.row[1][1].text).to.equal('Credit');
          expect(cliuiSpy.row[1][2].text).to.equal('1.5');
          expect(cliuiSpy.row[1][3].text).to.equal('2');
          expect(cliuiSpy.row[1][4].text).to.equal('16 MAR 18');
          expect(cliuiSpy.row[1][5].text).to.equal('95/90');
        });
      });
    });
  });
});

class CliUiSpy {

  constructor() {

    this.divCallCount = 0;
    this.row = [];
  }

  div(...args) {

    this.row.push(args);
    this.divCallCount += 1;
  }
}
