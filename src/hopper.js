import fs from 'fs';
import path from 'path';
import cliui from 'cliui';

export default (proper, directory) => {

  return new Promise((resolve, reject) => {

    fs.readdir(directory, (err, files) => {

      if (err) {

        reject(err);
      } else {

        files.forEach(async (file) => {

          if (path.extname(file) === '.csv') {

            const fullPath = path.resolve(directory, file);
            const ui = cliui();

            ui.div(path.basename(file, '.csv'));

            await proper(ui, fullPath);
          }
        });

        resolve();
      }
    });
  });
};

