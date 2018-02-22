import { expect } from 'chai';
import path from 'path';
import hopper from '../../src/hopper';

describe('hopper Tests', () => {

  describe('when a directory has no csv files', () => {

    it('then proper is not called at all', async () => {

      let properCalledCount = 0;

      const properSpy = () => {
        properCalledCount += 1;
      };

      const dataDirectory = path.resolve(__dirname, './data/no-csv-dir');
      await hopper(properSpy, dataDirectory);
      expect(properCalledCount).to.equal(0);
    });
  });

  describe('when a directory has multiple csv files', () => {

    it('then proper is called once for each file', async () => {

      let properCalledCount = 0;

      const properSpy = () => {
        properCalledCount += 1;
      };

      const dataDirectory = path.resolve(__dirname, './data/option-data-dir');

      await hopper(properSpy, dataDirectory);
      expect(properCalledCount).to.equal(3);
    });
  });
});
