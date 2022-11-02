const fs = require('fs'),
      path = require('path');

const fsPromises = fs.promises;

fs.stat(path.join(__dirname, 'files-copy'), function(err) {
  if (!err) {

    fs.readdir(path.join(__dirname, 'files-copy'), { withFileTypes: true }, (err, files) => {
      if (err) {
        console.log(err);
      } else {
        files.forEach(files => {
          fs.unlink(path.join(__dirname, 'files-copy', files.name), err => {
            if(err) throw err;
          });
        });
      }
    });

    fs.readdir(path.join(__dirname, 'files'), { withFileTypes: true }, (err, files) => {
    if (err) {
      console.log(err);
    } else {
      files.forEach(files => {
        fs.copyFile(path.join(__dirname, 'files', files.name), path.join(__dirname, 'files-copy', files.name), err => {
          if(err) throw err;
        });
      });
    }
    });

  } else if (err.code === 'ENOENT') {

    fsPromises.mkdir(path.join(__dirname, 'files-copy'), { recursive: true });

    fs.readdir(path.join(__dirname, 'files'), { withFileTypes: true }, (err, files) => {
      if (err) {
        console.log(err);
      } else {
        files.forEach(files => {
          fs.copyFile(path.join(__dirname, 'files', files.name), path.join(__dirname, 'files-copy', files.name), err => {
            if(err) throw err;
         });
        });
      }
    });
  }
});