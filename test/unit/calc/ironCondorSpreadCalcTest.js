import { expect } from 'chai';
import { calculateMaxRisk, filterValidIronCondors } from '../../../src/calc/ironCondorSpreadCalc';

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

  describe('given anchor strike has greatest cost', () => {

    describe('when filtering possible iron condors', () => {

      it('returns spreads with total credit greater than fair and equitable cost of trade', () => {

        const callSpread = {
          credit: 1.10,
          fairAndEquitableCost: 1.50,
          anchorStrikeProbItm: 15.00,
        };

        const putSideSpreads = [
          {
            credit: 0.50,
            fairAndEquitableCost: 0.50,
            anchorStrikeProbItm: 13.00,
          },
          {
            credit: 0.10,
            fairAndEquitableCost: 0.30,
            anchorStrikeProbItm: 11.00,
          },
          {
            credit: 0.65,
            fairAndEquitableCost: 0.15,
            anchorStrikeProbItm: 12.00,
          },
        ];

        const validIronCondors = filterValidIronCondors(callSpread, putSideSpreads);
        expect(validIronCondors).to.have.lengthOf(2);
      });
    });
  });

  describe('given put side strike has the greatest cost', () => {

    describe('when filtering possible iron condors', () => {

      it('returns spreads with total credit greater than fair and equitable cost of trade', () => {

        const callSpread = {
          credit: 1.10,
          fairAndEquitableCost: 1.50,
          anchorStrikeProbItm: 5.00,
        };

        const putSideSpreads = [
          {
            credit: 0.50,
            fairAndEquitableCost: 0.50,
            anchorStrikeProbItm: 13.00,
          },
          {
            credit: 0.10,
            fairAndEquitableCost: 3.30,
            anchorStrikeProbItm: 11.00,
          },
          {
            credit: 0.65,
            fairAndEquitableCost: 6.15,
            anchorStrikeProbItm: 12.00,
          },
        ];

        const validIronCondors = filterValidIronCondors(callSpread, putSideSpreads);
        expect(validIronCondors).to.have.lengthOf(1);
      });
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
});
