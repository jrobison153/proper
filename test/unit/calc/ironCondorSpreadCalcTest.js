import { expect } from 'chai';
import {
  calculateFairAndEquitableCost,
  calculateMaxRisk,
  filterValidIronCondors,
} from '../../../src/calc/ironCondorSpreadCalc';

describe('ironCondorSpreadCalc Tests', () => {

  describe('when filtering possible iron condors', () => {

    it('returns an empty array if none are valid', () => {

      const callSpread = {
        credit: 0.50,
        fairAndEquitableCost: 1.00,
        anchorStrikeProbItm: 15.00,
      };

      const putSideSpreads = [
        {
          credit: 0.25,
          anchorStrikeProbItm: 15.00,
        },
        {
          credit: 0.15,
          anchorStrikeProbItm: 15.00,
        },
      ];

      const validIronCondors = filterValidIronCondors(callSpread, putSideSpreads);
      expect(validIronCondors).to.have.lengthOf(0);
    });
  });


  describe('when filtering possible iron condors', () => {

    it('returns spreads with total credit greater than fair and equitable cost of trade', () => {

      const callSpread = {
        credit: 1.10,
        fairAndEquitableCost: 1.50,
      };

      const putSideSpreads = [
        {
          credit: 0.80,
          fairAndEquitableCost: 0.35,
        },
        {
          credit: 0.10,
          fairAndEquitableCost: 0.30,
        },
        {
          credit: 0.65,
          fairAndEquitableCost: 0.15,
        },
      ];

      const validIronCondors = filterValidIronCondors(callSpread, putSideSpreads);
      expect(validIronCondors).to.have.lengthOf(2);
    });
  });

  describe('when calculating max risk', () => {

    it('returns the put spread risk when it has the greatest risk', () => {

      const callSpread = {
        risk: 5,
      };

      const putSpread = {
        risk: 10,
      };

      const risk = calculateMaxRisk(callSpread, putSpread);

      expect(risk).to.equal(10);
    });

    it('returns the call spread risk when it has the greatest risk', () => {

      const callSpread = {
        risk: 15,
      };

      const putSpread = {
        risk: 10,
      };

      const risk = calculateMaxRisk(callSpread, putSpread);

      expect(risk).to.equal(15);
    });
  });

  describe('when calculating fair and equitable cost', () => {

    it('returns the sum of the call and put spread FAE costs', () => {

      const callSpread = {
        fairAndEquitableCost: 2.0,
      };

      const putSpread = {
        fairAndEquitableCost: 1.2,
      };

      const faeCost = calculateFairAndEquitableCost(callSpread, putSpread);
      expect(faeCost).to.equal(3.20);
    });
  });
});
