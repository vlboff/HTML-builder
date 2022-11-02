const fs = require('fs'),
      path = require('path'),
      process = require('process');

fs.stat(path.join(__dirname, 'files-copy'), function(err) {
  if (!err) {

    fs.truncate(path.join(__dirname, 'project-dist', 'bundle.css'), err => {
      if(err) throw err;
    });

    let bundle = fs.createWriteStream(path.join(__dirname, 'project-dist', 'bundle.css')); //?

    fs.readdir(path.join(__dirname, 'styles'), { withFileTypes: true }, (err, files) => {
      if (err) {
        console.log(err);
      } else {
        files.forEach(files => {
          if (files.isFile() === true) {
            let extension = path.extname(files.name).slice(1);
            if (extension === 'css') {
                let reader = fs.createReadStream(path.join(__dirname, 'styles', files.name));

                reader.on('data', function (data) {
                  bundle.write(String(data));
                });
            }
          }
        });
      }
    });

  } else if (err.code === 'ENOENT') {

    let bundle = fs.createWriteStream(path.join(__dirname, 'project-dist', 'bundle.css'));

    fs.readdir(path.join(__dirname, 'styles'), { withFileTypes: true }, (err, files) => {
      if (err) {
        console.log(err);
      } else {
        files.forEach(files => {
          if (files.isFile() === true) {
            let extension = path.extname(files.name).slice(1);
            if (extension === 'css') {
                let reader = fs.createReadStream(path.join(__dirname, 'styles', files.name));

                reader.on('data', function (data) {
                  bundle.write(String(data));
                });
            }
          }
        });
      }
    });

  }
});