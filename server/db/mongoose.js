const mongoose = require('mongoose');
const db = require('./database.js');

mongoose.Promise = global.Promise;
mongoose.connect(process.env.mongoURI).then(() => {

}).catch((err) => {
  console.log(err);
});


module.exports = {
  mongoose: mongoose
};
