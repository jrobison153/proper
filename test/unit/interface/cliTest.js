import { expect } from 'chai';
import cli from '../../../src/interface/cli';

describe('cli Tests', () => {

  let consoleSpy;
  let hopperSpy;
  let hopperDirectory;

  beforeEach(() => {

    hopperDirectory = '';

    hopperSpy = (proper, directory) => {
      hopperDirectory = directory;
    };

    consoleSpy = new ConsoleSpy();
  });

  describe('when required parameters not passed', () => {

    let returnCode;
    beforeEach(() => {

      returnCode = cli(hopperSpy, consoleSpy);
    });

    it('returns a non-zero status code', () => {

      expect(returnCode).to.equal(1);
    });

    it('prints basic usage to the console', () => {

      expect(consoleSpy.lastLogMessage).to.match(/.*Basic Usage: oa-proper.*/);
    });
  });

  describe('when required parameters passed', () => {

    let originalArgv;

    beforeEach(() => {

      originalArgv = process.argv;
    });

    afterEach(() => {

      process.argv = originalArgv;
    });

    it('passes the data-dir (resolved to an absolute path) to hopper', () => {

      process.argv = ['', '', '--data-dir', 'some/directory'];

      cli(hopperSpy, consoleSpy);
      expect(hopperDirectory).to.match(/^\/.*\/some\/directory.*/);
    });
  });
});

class ConsoleSpy {

  log(msg) {

    this.lastLogMessage = msg;
  }
}
