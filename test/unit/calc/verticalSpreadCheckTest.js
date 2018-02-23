/* eslint-disable no-unused-expressions */
import { expect } from 'chai';
import {
  calculateCredit, calculateFairAndEquitableRatio, fairAndEquitableCost, isExpiringInSameMonth,
  isFairAndEquitable,
} from '../../../src/calc/verticalSpreadCheck';

describe('verticalSpreadCheck Tests', () => {

  let shortStrikeOption;
  let longStrikeOption;

  beforeEach(() => {

    shortStrikeOption = {
      strike: 90,
      probItm: 30.00,
      mark: 10,
      expiration: '16 MAR 18',
    };

    longStrikeOption = {
      strike: 100,
      probItm: 20.00,
      mark: 5,
      expiration: '16 MAR 18',
    };
  });

  describe('given vertical call spread setup', () => {


    describe('when checking fair and equitable trade', () => {

      it('returns true if the width of the strikes times the probability of the short strike ITM is' +
        ' less than the net credit', () => {

        expect(isFairAndEquitable(shortStrikeOption, longStrikeOption)).to.be.true;
      });

      it('returns false if the width of the strikes times the probability of the short strike ITM is' +
        ' greater than the net credit', () => {


        longStrikeOption.mark = 9;
        expect(isFairAndEquitable(shortStrikeOption, longStrikeOption)).to.be.false;
      });
    });
  });

  describe('when calculating fair and equitable cost', () => {

    describe('and the difference between short and long strikes is a negative number', () => {

      it('returns a positive value', () => {

        const cost = fairAndEquitableCost(shortStrikeOption, longStrikeOption);

        expect(cost).to.equal(3);
      });
    });

    it('formats the result to 2 decimal places', () => {

      shortStrikeOption.probItm = 31.25;

      const cost = fairAndEquitableCost(shortStrikeOption, longStrikeOption);

      expect(cost).to.equal(3.13);
    });
  });

  describe('when calculating credit', () => {

    it('returns the difference between short and long option marks', () => {

      const credit = calculateCredit(shortStrikeOption, longStrikeOption);

      expect(credit).to.equal(5);
    });

    it('formats the result to two decimal places', () => {

      shortStrikeOption.mark = 14.253;
      longStrikeOption.mark = 10.000;

      const credit = calculateCredit(shortStrikeOption, longStrikeOption);

      expect(credit).to.equal(4.25);
    });
  });

  describe('when calculating fair and equitable ration', () => {

    it('calculates the ratio of credit to fae cost rounded to 2 decimal places', () => {

      const ratio = calculateFairAndEquitableRatio(shortStrikeOption, longStrikeOption);

      expect(ratio).to.equal(1.67);
    });
  });

  describe('when determining if options have the same expiration month', () => {

    it('returns true if they are the same', () => {

      const result = isExpiringInSameMonth(shortStrikeOption, longStrikeOption);

      expect(result).to.be.true;
    });

    it('returns false if they are not the same', () => {

      longStrikeOption.expiration = '21 APR 18';

      const result = isExpiringInSameMonth(shortStrikeOption, longStrikeOption);

      expect(result).to.be.false;
    });
  });
});
