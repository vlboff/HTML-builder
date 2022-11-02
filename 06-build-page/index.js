const fs = require('fs'),
      path = require('path');

const fsPromises = fs.promises;
const pathAssets = path.join(__dirname, 'assets');
const pathNewAssets = path.join(__dirname, 'project-dist', 'assets');

fsPromises.mkdir(path.join(__dirname, 'project-dist'), { recursive: true });

// assets

function copyDir(assets, newAssets) {                               // копируем соджержимое assets
  fsPromises.mkdir(newAssets, { recursive: true });

  fs.readdir(assets, { withFileTypes: true }, (err, content) => {

    if (err) {
      console.log(err);
    } else {
      for (let i of content) {
        const fileName = i.name;
        if (i.isDirectory()) {
          copyDir(path.join(assets, fileName), path.join(newAssets, fileName));
        }
        fs.copyFile(path.join(assets, fileName), path.join(newAssets, fileName), () => { });
      }
    }
  });
}

function cleanDir(newAssets) {                               // удаляем соджержимое assets
  fs.readdir(newAssets, { withFileTypes: true }, (err, content) => {

    if (err) {
      console.log(err);
    } else {
      for (let i of content) {
        const fileName = i.name;
        if (i.isDirectory()) {
          cleanDir(path.join(newAssets, fileName));
        } else {
        fs.unlink(path.join(newAssets, fileName), err => {
          if(err) throw err;
          });
        }
      }
    }
  });
}

fs.stat(path.join(__dirname, 'project-dist', 'assets'), function(err) {
  if (!err) {                                                         // если папка есть

    cleanDir(pathNewAssets);

    copyDir(pathAssets, pathNewAssets);

  } else if (err.code === 'ENOENT') {                                 // если папки нет

    copyDir(pathAssets, pathNewAssets);

  }
});



// styles
fs.stat(path.join(__dirname, 'project-dist', 'style.css'), function(err) {

  if (!err) {

  fs.truncate(path.join(__dirname, 'project-dist', 'style.css'), err => {
    if(err) throw err;
  });

  let bundle = fs.createWriteStream(path.join(__dirname, 'project-dist', 'style.css'));

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

  let bundle = fs.createWriteStream(path.join(__dirname, 'project-dist', 'style.css'));

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


//index

async function htmlCreator() {

  let temp = await fs.promises.readFile(path.join(__dirname, 'template.html'), 'utf-8');

  const components = await fs.promises.readdir(path.join(__dirname, 'components'), { withFileTypes: true });

  for (let i in components) {
    if (components[i].isFile() === true) {
      let extension = path.extname(components[i].name).slice(1);
          if (extension === 'html') {
            let componentReader = await fs.promises.readFile(path.join(__dirname, 'components', components[i].name), 'utf-8');
            temp = temp.replace(`{{${path.basename(components[i].name, '.html')}}}`, componentReader);
          }
    }
  }

  fs.writeFile(path.join(__dirname, 'project-dist', 'index.html'), temp, err => { if (err) throw err; });

}


fs.stat(path.join(__dirname, 'project-dist', 'index.html'), function(err) {

  if (!err) {
    fs.truncate(path.join(__dirname, 'project-dist', 'index.html'), err => {
      if(err) throw err;
    });

    htmlCreator();

  } else if (err.code === 'ENOENT') {

    htmlCreator();

  }
});