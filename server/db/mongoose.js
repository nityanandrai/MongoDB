const mongoose = require('mongoose');
const db = require('./database.js');

mongoose.Promise = global.Promise;
mongoose.connect(db.mongoURI).then(() => {

}).catch((err) => {
  console.log(err);
});


module.exports = {
  mongoose: mongoose
};
