/* eslint-disable no-unused-expressions */
import { expect } from 'chai';
import bearCallSpreadFinder from '../../../src/strategies/bearCallSpreadFinder';

describe('bearCallSpreadFinder Tests', () => {

  describe('when finding spreads', () => {

    let spiedIsCreditPotentialStrikesFunction;
    let verticalCreditSpreadFinderSpy;
    const expectedFoundSpreads = [{
      strike: 20,
    },
    {
      strike: 30,
    }];

    beforeEach(() => {

      spiedIsCreditPotentialStrikesFunction;

      verticalCreditSpreadFinderSpy = (data, isCreditPotentialStrikes) => {

        spiedIsCreditPotentialStrikesFunction = isCreditPotentialStrikes;
        return expectedFoundSpreads;
      };
    });

    it('calls the verticalCreditSpreadFinder with the correct credit strike finder function', () => {

      bearCallSpreadFinder({}, verticalCreditSpreadFinderSpy);

      const shortStrike = { strike: 10 };
      const longStrike = { strike: 30 };

      const strikeComparison = spiedIsCreditPotentialStrikesFunction(shortStrike, longStrike);

      expect(strikeComparison).to.be.true;
    });

    it('returns the result of the verticalCreditSpreadFinder', () => {

      const spreads = bearCallSpreadFinder({}, verticalCreditSpreadFinderSpy);
      expect(spreads).to.deep.equal(expectedFoundSpreads);
    });
  });
});
