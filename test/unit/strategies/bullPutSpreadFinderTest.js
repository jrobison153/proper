import { expect } from 'chai';
import bullPutSpreadFinder from '../../../src/strategies/bullPutSpreadFinder';
import {
  oneSpreadNonSiblingStrikeData,
  oneSpreadSiblingStrikeData,
  threeSpreadsStrikeData,
  multipleAnchorMultipleSpreadsStrikeData,
} from './data/optionData';

describe('bullPutSpreadFinder Tests', () => {

  describe('when no spreads found meeting entry criteria', () => {

    it('returns and empty array', () => {

      const noSpreadsData = [{
        probItm: 1.00,
      },
      {
        probItm: 1.5,
      }];

      const bullPutSpreads = bullPutSpreadFinder(noSpreadsData);
      expect(bullPutSpreads).to.have.lengthOf(0);
    });
  });

  describe('given single valid anchor strike', () => {

    describe('when valid spread found on strikes next to each other', () => {

      it('returns a valid trade-able spread', () => {

        const bullPutSpreads = bullPutSpreadFinder(oneSpreadSiblingStrikeData);

        expect(bullPutSpreads).to.have.lengthOf(1);
      });
    });

    describe('when valid spread found on strikes not next to each other', () => {

      it('returns a valid trade-able spread', () => {

        const bullPutSpreads = bullPutSpreadFinder(oneSpreadNonSiblingStrikeData);

        expect(bullPutSpreads).to.have.lengthOf(1);
      });
    });

    describe('when multiple valid spreads found for anchor strike', () => {

      it('returns all valid spreads', () => {

        const bullPutSpreads = bullPutSpreadFinder(threeSpreadsStrikeData);

        expect(bullPutSpreads).to.have.lengthOf(3);
      });
    });
  });

  describe('given multiple valid anchor strikes', () => {

    it('all valid spread combinations', () => {

      const bullPutSpreads = bullPutSpreadFinder(multipleAnchorMultipleSpreadsStrikeData);

      expect(bullPutSpreads).to.have.lengthOf(7);
    });
  });

  describe('when valid trade-able spread found', () => {

    let bullPutSpreads;

    before(() => {
      bullPutSpreads = bullPutSpreadFinder(oneSpreadSiblingStrikeData);
    });

    it('returns the fairAndEquitableValue field set correctly', () => {

      expect(bullPutSpreads[0].fairAndEquitableCost).to.equal(4.5);
    });

    it('returns the credit field set correctly', () => {

      expect(bullPutSpreads[0].credit).to.equal(8);
    });

    it('returns the fairAndEquitableRatio field set correctly', () => {

      const expectedRatio = parseFloat((8 / 4.5).toFixed(2));
      expect(bullPutSpreads[0].fairAndEquitableRatio).to.equal(expectedRatio);
    });

    it('returns the expiration field set correctly', () => {

      expect(bullPutSpreads[0].expiration).to.equal('16 MAR 18');
    });

    it('returns the strikes field set correctly', () => {

      expect(bullPutSpreads[0].strikes).to.equal('165/150');
    });
  });
});
