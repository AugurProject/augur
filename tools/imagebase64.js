var fs = require('fs');

fs.readFile('./tools/lena.png', function(err, data) {
    if (err) throw err; // Fail if the file can't be read.
    console.log(data);
});