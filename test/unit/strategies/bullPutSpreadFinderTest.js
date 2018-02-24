/* eslint-disable no-unused-expressions */
import { expect } from 'chai';
import bullPutSpreadFinder from '../../../src/strategies/bullPutSpreadFinder';

describe('bullPutSpreadFinder Tests', () => {

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

      verticalCreditSpreadFinderSpy = () => {

        return (data, isCreditPotentialStrikes) => {

          spiedIsCreditPotentialStrikesFunction = isCreditPotentialStrikes;
          return expectedFoundSpreads;
        };
      }
    });

    it('calls the verticalCreditSpreadFinder with the correct credit strike finder function', () => {

      bullPutSpreadFinder({}, verticalCreditSpreadFinderSpy());

      const shortStrike = { strike: 30 };
      const longStrike = { strike: 10 };

      const strikeComparison = spiedIsCreditPotentialStrikesFunction(shortStrike, longStrike);

      expect(strikeComparison).to.be.true;
    });

    it('returns the result of the verticalCreditSpreadFinder', () => {

      const spreads = bullPutSpreadFinder({}, verticalCreditSpreadFinderSpy());
      expect(spreads).to.deep.equal(expectedFoundSpreads);
    });
  });
});
