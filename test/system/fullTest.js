import path from 'path';
import hopper from '../../src/hopper';
import proper from '../../src/proper';

describe('full system test', () => {

  it('generates a list of all good trade entry candidates', async () => {

    const optionDataDir = path.resolve(__dirname, './data');
    await hopper(proper, optionDataDir);
  });
});
