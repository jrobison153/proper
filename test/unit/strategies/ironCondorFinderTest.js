/* eslint-disable no-unused-expressions */
import { expect } from 'chai';
import ironCondorFinder from '../../../src/strategies/ironCondorFinder';

describe('ironCondorFinder Tests', () => {

  const optionData = {
    calls: [],
    pugs: [],
  };

  let singleIronCondorCallSideSpreads;

  let singleIronCondorPutSideSpreads;

  let verticalCreditSpreadFinderSpy;
  let spreadConfig;

  let bearCallOptionData;
  let bearCallCreditSpreadFinderSpy;
  let bearCallSpiedVerticalSpreadFinder;

  let bullPutOptionData;
  let bullPutCreditSpreadFinderSpy;
  let bullPutSpiedVerticalSpreadFinder;

  beforeEach(() => {

    singleIronCondorCallSideSpreads = [{
      credit: 2,
      expiration: '16 MAR 18',
      fairAndEquitableCost: 3,
      anchorStrikeProbItm: 15.00,
      risk: 15,
      strikes: '55/60',
    }];

    singleIronCondorPutSideSpreads = [{
      credit: 1.5,
      expiration: '16 MAR 18',
      fairAndEquitableCost: 0.50,
      anchorStrikeProbItm: 7.00,
      risk: 5,
      strikes: '50/45',
    }];

    bearCallCreditSpreadFinderSpy = {};
    bearCallSpiedVerticalSpreadFinder = () => {};

    bullPutCreditSpreadFinderSpy = {};
    bullPutSpiedVerticalSpreadFinder = () => {};

    spreadConfig = {};

    bullPutCreditSpreadFinderSpy = (data, spreadFinder) => {

      bullPutOptionData = data;
      bullPutSpiedVerticalSpreadFinder = spreadFinder;

      return singleIronCondorPutSideSpreads;
    };

    bearCallCreditSpreadFinderSpy = (data, spreadFinder) => {

      bearCallOptionData = data;
      bearCallSpiedVerticalSpreadFinder = spreadFinder;

      return singleIronCondorCallSideSpreads;
    };

    const innerFunc = () => {

    };

    verticalCreditSpreadFinderSpy = (options) => {

      spreadConfig = options;

      return innerFunc();
    };
  });

  describe('when looking for spreads without need for FaE check', () => {

    it('passes the skipFaE check config parameter to the verticalCallSpreadFinder', () => {

      const options = {
        isNormalIronCondor: true,
      };

      ironCondorFinder(
        optionData, bearCallCreditSpreadFinderSpy,
        bullPutCreditSpreadFinderSpy, verticalCreditSpreadFinderSpy, options,
      );
      expect(spreadConfig.skipFaECheck).to.be.true;
    });
  });

  describe('when no iron condors found', () => {

    it('returns an empty array', () => {

      const noIronCondorData = { calls: [], puts: [] };

      singleIronCondorCallSideSpreads[0].credit = 0;

      const ironCondors = ironCondorFinder(
        noIronCondorData, bearCallCreditSpreadFinderSpy,
        bullPutCreditSpreadFinderSpy, verticalCreditSpreadFinderSpy,
      );

      expect(ironCondors).to.have.lengthOf(0);
    });
  });

  describe('when locating call side credit spreads', () => {

    beforeEach(() => {

      ironCondorFinder(
        optionData, bearCallCreditSpreadFinderSpy,
        bullPutCreditSpreadFinderSpy, verticalCreditSpreadFinderSpy,
      );
    });

    it('passes the call option data to the bear call credit spread finder', () => {

      expect(bearCallOptionData).to.equal(optionData.calls);
    });

    it('passes the vertical call credit spread finder to the bear call credit spread finder', () => {

      expect(bearCallSpiedVerticalSpreadFinder).to.equal(verticalCreditSpreadFinderSpy());
    });

    it('sets the In the Money minimum percent to 13%', () => {

      expect(spreadConfig.minProbItmPercent).to.equal(13.00);
    });

    it('sets the In the Money maximum percent to 17%', () => {

      expect(spreadConfig.maxProbItmPercent).to.equal(17.00);
    });
  });

  describe('when locating put side credit spreads', () => {

    beforeEach(() => {

      ironCondorFinder(
        optionData, bearCallCreditSpreadFinderSpy,
        bullPutCreditSpreadFinderSpy, verticalCreditSpreadFinderSpy,
      );
    });

    it('passes the put option data to the bull put credit spread finder', () => {

      expect(bullPutOptionData).to.equal(optionData.puts);
    });

    it('passes the vertical call credit spread finder to the bull put credit spread finder', () => {

      expect(bullPutSpiedVerticalSpreadFinder).to.equal(verticalCreditSpreadFinderSpy());
    });

    it('sets the In the Money minimum percent to 13%', () => {

      expect(spreadConfig.minProbItmPercent).to.equal(13.00);
    });

    it('sets the In the Money maximum percent to 17%', () => {

      expect(spreadConfig.maxProbItmPercent).to.equal(17.00);
    });
  });

  describe('when Iron Condors found', () => {

    let spreads;
    beforeEach(() => {

      spreads = ironCondorFinder(
        optionData, bearCallCreditSpreadFinderSpy,
        bullPutCreditSpreadFinderSpy, verticalCreditSpreadFinderSpy,
      );

    });

    it('returns the credit earned on the trade', () => {

      expect(spreads[0].credit).to.equal(3.5);
    });

    it('returns the expiration date', () => {

      expect(spreads[0].expiration).to.equal('16 MAR 18');
    });

    it('returns the fair and equitable ratio', () => {

      expect(spreads[0].fairAndEquitableRatio).to.equal(1);
    });

    it('returns the strikes', () => {

      expect(spreads[0].strikes).to.equal('55/60/50/45');
    });

    it('returns the fair and equitable cost of the trade', () => {

      expect(spreads[0].fairAndEquitableCost).to.equal(3.50);
    });

    it('returns the risk of the trade per contract sold', () => {

      expect(spreads[0].risk).to.equal(15);
    });

    it('returns the reward risk ratio of the trade per contract sold', () => {

      expect(spreads[0].rewardRiskRatio).to.equal(0.23);
    });
  });
});
