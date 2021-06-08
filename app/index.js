require('dotenv').config();
require('colors');

const database = require('./database');
const server = require('./server');

(() => {
  console.info(
    '📦 "Bassthalk "'.blue +
    ' API backend ⚡️ powered by '.green +
    '" 7ottos & Remah "'.magenta
  );
  database.connect(function () {
    console.info('📯 Mongodb is connected'.blue);
    server.up(function () {
      console.info(
        '🔌 Server is listening at '.green + 'http://localhost:%d'.yellow,
        this.address().port
      );
      console.info('🕹  Enjoy! 😚'.green);
    });
  });
})();
