import { expect } from 'chai';
import verticalCreditSpreadFinder from '../../../src/strategies/verticalCreditSpreadFinder';
import {
  oneSpreadNonSiblingStrikeData,
  oneSpreadSiblingStrikeData,
  threeSpreadsStrikeData,
  multipleAnchorMultipleSpreadsStrikeData,
  mixedMonthMultipleSpreadsData,
  lowOpenInterestSpreadsData,
} from './data/optionData';

describe('verticalCreditSpreadFinder Tests', () => {

  const isCreditPotentialStrikes = (shortStrike, longStrike) => {

    return longStrike.strike < shortStrike.strike;
  };

  describe('when options specified', () => {

    it('uses the provided minimum In the Money percent', () => {

      const options = {
        minProbItmPercent: 5,
      };

      const verticalSpreads =
        verticalCreditSpreadFinder(options)(oneSpreadNonSiblingStrikeData, isCreditPotentialStrikes);

      expect(verticalSpreads).to.have.lengthOf(2);
    });

    it('uses the provided maximum In the Money percent', () => {

      const options = {
        minProbItmPercent: 50,
        maxProbItmPercent: 75,
      };

      const verticalSpreads =
        verticalCreditSpreadFinder(options)(oneSpreadNonSiblingStrikeData, isCreditPotentialStrikes);

      expect(verticalSpreads).to.have.lengthOf(1);
    });

    it('skips the FaE check when skipFaECheck is true', () => {

      const options = {
        skipFaECheck: true,
      };

      const verticalSpreads =
        verticalCreditSpreadFinder(options)(oneSpreadNonSiblingStrikeData, isCreditPotentialStrikes);

      expect(verticalSpreads).to.have.lengthOf(2);
    });
  });

  describe('when no spreads found meeting entry criteria', () => {

    it('returns and empty array', () => {

      const noSpreadsData = [{
        probItm: 1.00,
      },
      {
        probItm: 1.5,
      }];

      const verticalSpreads = verticalCreditSpreadFinder()(noSpreadsData, isCreditPotentialStrikes);
      expect(verticalSpreads).to.have.lengthOf(0);
    });
  });

  describe('given single valid anchor strike', () => {

    describe('when valid spread found on strikes next to each other', () => {

      it('returns a valid trade-able spread', () => {

        const verticalSpreads = verticalCreditSpreadFinder()(oneSpreadSiblingStrikeData, isCreditPotentialStrikes);

        expect(verticalSpreads).to.have.lengthOf(1);
      });
    });

    describe('when valid spread found on strikes not next to each other', () => {

      it('returns a valid trade-able spread', () => {

        const verticalSpreads = verticalCreditSpreadFinder()(oneSpreadNonSiblingStrikeData, isCreditPotentialStrikes);

        expect(verticalSpreads).to.have.lengthOf(1);
      });
    });

    describe('when multiple valid spreads found for anchor strike', () => {

      it('returns all valid spreads', () => {

        const verticalSpreads = verticalCreditSpreadFinder()(threeSpreadsStrikeData, isCreditPotentialStrikes);

        expect(verticalSpreads).to.have.lengthOf(3);
      });
    });
  });

  describe('given multiple valid anchor strikes', () => {

    it('returns all valid spread combinations', () => {

      const verticalSpreads =
        verticalCreditSpreadFinder()(multipleAnchorMultipleSpreadsStrikeData, isCreditPotentialStrikes);

      expect(verticalSpreads).to.have.lengthOf(7);
    });
  });

  describe('when valid trade-able spread found', () => {

    let verticalSpreads;

    before(() => {
      verticalSpreads = verticalCreditSpreadFinder()(oneSpreadSiblingStrikeData, isCreditPotentialStrikes);
    });

    it('returns the fairAndEquitableValue field set correctly', () => {

      expect(verticalSpreads[0].fairAndEquitableCost).to.equal(4.5);
    });

    it('returns the credit field set correctly', () => {

      expect(verticalSpreads[0].credit).to.equal(8);
    });

    it('returns the fairAndEquitableRatio field set correctly', () => {

      const expectedRatio = parseFloat((8 / 4.5).toFixed(2));
      expect(verticalSpreads[0].fairAndEquitableRatio).to.equal(expectedRatio);
    });

    it('returns the expiration field set correctly', () => {

      expect(verticalSpreads[0].expiration).to.equal('16 MAR 18');
    });

    it('returns the strikes field set correctly', () => {

      expect(verticalSpreads[0].strikes).to.equal('165/150');
    });

    it('returns the anchor strike probability ITM field set correctly', () => {

      expect(verticalSpreads[0].anchorStrikeProbItm).to.equal(30.00);
    });

    it('returns the width of strikes field set correctly', () => {

      expect(verticalSpreads[0].strikeWidth).to.equal(15);
    });

    it('returns the risk of a single contract', () => {

      expect(verticalSpreads[0].risk).to.equal(15);
    });

    it('returns the reward risk ratio of a single contract', () => {

      expect(verticalSpreads[0].rewardRiskRatio).to.equal(0.53);
    });
  });

  describe('given option data with different expiration months', () => {

    it('does not return spreads crossing expiration months', () => {

      const verticalSpreads = verticalCreditSpreadFinder()(mixedMonthMultipleSpreadsData, isCreditPotentialStrikes);
      expect(verticalSpreads).to.have.lengthOf(3);
    });
  });

  describe('when option has too open interest', () => {

    it('does not return spreads', () => {

      const verticalSpreads = verticalCreditSpreadFinder()(lowOpenInterestSpreadsData, isCreditPotentialStrikes);
      expect(verticalSpreads).to.have.lengthOf(0);
    });
  });
});
