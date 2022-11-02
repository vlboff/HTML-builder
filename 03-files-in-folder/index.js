const fs = require('fs'),
      path = require('path');

fs.readdir(path.join(__dirname, 'secret-folder'), { withFileTypes: true }, (err, files) => {
  if (err) {
    console.log(err);
  } else {
    console.log("\nCurrent directory filenames:");
    files.forEach(files => {
      if (files.isFile() === true) {
        let name = '';
        if (files.name.indexOf(".") != -1) {
          name = files.name.slice(0, files.name.indexOf("."));
        }
        let extension = path.extname(files.name).slice(1);
        fs.stat(path.join(__dirname, 'secret-folder', files.name), (error, stats) => {
          if (error) {
            console.log(error);
          } else {
            console.log(`${name} - ${extension} - ${stats.size} bites`);
          }
        });
      }
    });
  }
});
