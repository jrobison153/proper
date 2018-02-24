import { expect } from 'chai';
import proper from '../../src/proper';

describe('fileFeatures Tests', () => {

  describe('given a correctly formatted option data csv file', () => {

    describe('when scanned for fair and equitable trades', () => {

      it('prints each candidate out as a row in a table with correct headers', async () => {

        const cliuiSpy = new CliUiSpy();
        const inputFile = require.resolve('./data/BPuSgoodData.csv');
        await proper(cliuiSpy, inputFile);

        expect(cliuiSpy.row[0][0].text).to.equal('Strategy');
        expect(cliuiSpy.row[0][1].text).to.equal('Credit/Debit');
        expect(cliuiSpy.row[0][2].text).to.equal('Risk');
        expect(cliuiSpy.row[0][3].text).to.equal('Reward/Risk Ratio');
        expect(cliuiSpy.row[0][4].text).to.equal('FaE Cost');
        expect(cliuiSpy.row[0][5].text).to.equal('FaE Cost Ratio');
        expect(cliuiSpy.row[0][6].text).to.equal('Expiration');
        expect(cliuiSpy.row[0][7].text).to.equal('Strikes');
      });

      describe('and vertical PUT credit spreads found', () => {

        it('prints the fields in the correct columns', async () => {

          const cliuiSpy = new CliUiSpy();
          const inputFile = require.resolve('./data/BPuSgoodData.csv');
          await proper(cliuiSpy, inputFile);

          expect(cliuiSpy.row[1][0].text).to.equal('Bull Put Spread');
          expect(cliuiSpy.row[1][1].text).to.equal('2');
          expect(cliuiSpy.row[1][2].text).to.equal('5');
          expect(cliuiSpy.row[1][3].text).to.equal('0.4');
          expect(cliuiSpy.row[1][4].text).to.equal('1.6');
          expect(cliuiSpy.row[1][5].text).to.equal('1.25');
          expect(cliuiSpy.row[1][6].text).to.equal('16 MAR 18');
          expect(cliuiSpy.row[1][7].text).to.equal('95/90');
        });
      });

      describe('and vertical Call credit spreads found', () => {

        it('prints the fields in the correct columns', async () => {

          const cliuiSpy = new CliUiSpy();
          const inputFile = require.resolve('./data/BCaSgoodData.csv');
          await proper(cliuiSpy, inputFile);

          expect(cliuiSpy.row[1][0].text).to.equal('Bear Call Spread');
          expect(cliuiSpy.row[1][1].text).to.equal('2');
          expect(cliuiSpy.row[1][2].text).to.equal('5');
          expect(cliuiSpy.row[1][3].text).to.equal('0.4');
          expect(cliuiSpy.row[1][4].text).to.equal('1.6');
          expect(cliuiSpy.row[1][5].text).to.equal('1.25');
          expect(cliuiSpy.row[1][6].text).to.equal('16 MAR 18');
          expect(cliuiSpy.row[1][7].text).to.equal('90/95');
        });
      });

      describe('and Full Credit Iron Condors found', () => {

        it('prints the fields in the correct columns', async () => {

          const cliuiSpy = new CliUiSpy();
          const inputFile = require.resolve('./data/FullCreditICgoodData.csv');
          await proper(cliuiSpy, inputFile);

          const firstFullCreditIronCondor = cliuiSpy.getFirstPrintedStrategy('Full Credit Iron Condor');

          expect(firstFullCreditIronCondor[0].text).to.equal('Full Credit Iron Condor');
          expect(firstFullCreditIronCondor[1].text).to.equal('4');
          expect(firstFullCreditIronCondor[2].text).to.equal('5');
          expect(firstFullCreditIronCondor[3].text).to.equal('0.8');
          expect(firstFullCreditIronCondor[4].text).to.equal('0.75');
          expect(firstFullCreditIronCondor[5].text).to.equal('5.33');
          expect(firstFullCreditIronCondor[6].text).to.equal('16 MAR 18');
          expect(firstFullCreditIronCondor[7].text).to.equal('90/95/95/90');
        });
      });

      describe('and Iron Condors found', () => {

        it('prints the fields in the correct columns', async () => {

          const cliuiSpy = new CliUiSpy();
          const inputFile = require.resolve('./data/ICgoodData.csv');
          await proper(cliuiSpy, inputFile);

          const firstIronCondor = cliuiSpy.getFirstPrintedStrategy('Iron Condor');

          expect(firstIronCondor[0].text).to.equal('Iron Condor');
          expect(firstIronCondor[1].text).to.equal('2.25');
          expect(firstIronCondor[2].text).to.equal('5');
          expect(firstIronCondor[3].text).to.equal('0.45');
          expect(firstIronCondor[4].text).to.equal('0.75');
          expect(firstIronCondor[5].text).to.equal('3');
          expect(firstIronCondor[6].text).to.equal('16 MAR 18');
          expect(firstIronCondor[7].text).to.equal('90/95/95/90');
        });
      });
    });
  });
});

class CliUiSpy {

  constructor() {

    this.row = [];
  }

  div(...args) {

    this.row.push(args);
  }

  getFirstPrintedStrategy(strategyName) {

    const matchingRows = this.row.filter((row) => {

      return row[0].text === strategyName;
    });

    return matchingRows[0];
  }
}
