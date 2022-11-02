const fs = require('fs'),
      path = require('path'),
      process = require('process');

const {stdin, stdout} = process;

let writableStream = fs.createWriteStream(path.join(__dirname, 'text.txt'));

stdout.write('Введите текст\n');
stdin.on('data', data => {
  if (String(data).trim() === 'exit') {
    stdout.write('Удачи в изучении Node.js!');
    process.exit();
  }
  writableStream.write(data);
});

process.on('SIGINT', () => {
  stdout.write('Удачи в изучении Node.js!');
  process.exit();
});

