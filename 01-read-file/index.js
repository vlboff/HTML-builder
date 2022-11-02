const fs = require('fs'),
      path = require('path');

let reader = fs.createReadStream(path.join(__dirname, 'text.txt'));

reader.on('data', function (data) {
    console.log(data.toString());
});