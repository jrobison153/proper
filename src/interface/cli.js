import minimist from 'minimist';
import path from 'path';
import proper from '../proper';

export default (hopper, console) => {

  const argv = minimist(process.argv.slice(2));
  let returnCode = 0;

  if (argv['data-dir']) {

    const resolvedDir = path.resolve(__dirname, argv['data-dir']);
    hopper(proper, resolvedDir);
  } else {

    returnCode = 1;
    console.log('Basic Usage: proper --data-dir');
  }
  return returnCode;
};
