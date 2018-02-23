import { expect } from 'chai';
import verticalCreditSpreadFinder from '../../../src/strategies/verticalCreditSpreadFinder';
import {
  oneSpreadNonSiblingStrikeData,
  oneSpreadSiblingStrikeData,
  threeSpreadsStrikeData,
  multipleAnchorMultipleSpreadsStrikeData,
  mixedMonthMultipleSpreadsData,
} from './data/optionData';

describe('verticalCreditSpreadFinder Tests', () => {

  const isCreditPotentialStrikes = (shortStrike, longStrike) => {

    return longStrike.strike < shortStrike.strike;
  };

  describe('when no spreads found meeting entry criteria', () => {

    it('returns and empty array', () => {

      const noSpreadsData = [{
        probItm: 1.00,
      },
      {
        probItm: 1.5,
      }];

      const bullPutSpreads = verticalCreditSpreadFinder(noSpreadsData, isCreditPotentialStrikes);
      expect(bullPutSpreads).to.have.lengthOf(0);
    });
  });

  describe('given single valid anchor strike', () => {

    describe('when valid spread found on strikes next to each other', () => {

      it('returns a valid trade-able spread', () => {

        const bullPutSpreads = verticalCreditSpreadFinder(oneSpreadSiblingStrikeData, isCreditPotentialStrikes);

        expect(bullPutSpreads).to.have.lengthOf(1);
      });
    });

    describe('when valid spread found on strikes not next to each other', () => {

      it('returns a valid trade-able spread', () => {

        const bullPutSpreads = verticalCreditSpreadFinder(oneSpreadNonSiblingStrikeData, isCreditPotentialStrikes);

        expect(bullPutSpreads).to.have.lengthOf(1);
      });
    });

    describe('when multiple valid spreads found for anchor strike', () => {

      it('returns all valid spreads', () => {

        const bullPutSpreads = verticalCreditSpreadFinder(threeSpreadsStrikeData, isCreditPotentialStrikes);

        expect(bullPutSpreads).to.have.lengthOf(3);
      });
    });
  });

  describe('given multiple valid anchor strikes', () => {

    it('all valid spread combinations', () => {

      const bullPutSpreads =
        verticalCreditSpreadFinder(multipleAnchorMultipleSpreadsStrikeData, isCreditPotentialStrikes);

      expect(bullPutSpreads).to.have.lengthOf(7);
    });
  });

  describe('when valid trade-able spread found', () => {

    let bullPutSpreads;

    before(() => {
      bullPutSpreads = verticalCreditSpreadFinder(oneSpreadSiblingStrikeData, isCreditPotentialStrikes);
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

  describe('given option data with different expiration months', () => {

    it('does not return spreads crossing expiration months', () => {

      const bullPutSpreads = verticalCreditSpreadFinder(mixedMonthMultipleSpreadsData, isCreditPotentialStrikes);
      expect(bullPutSpreads).to.have.lengthOf(3);
    });
  });
});
