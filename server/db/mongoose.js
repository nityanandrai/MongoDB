const mongoose = require('mongoose');
const db = require('./database.js');

mongoose.Promise = global.Promise;

mongoose.connect(db.mongoURI);

module.exports = {
  mongoose: mongoose
};
