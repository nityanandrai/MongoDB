const mongoose = require('mongoose');
const db = require('./database.js');

mongoose.Promise = global.Promise;

mongoose.connect(db.mongoURI).then(() => {
  console.log('Successful connected to mLab');
}).catch((err) => {
  console.log(err);
});
// mongoose.connect('mongoDB://localhost:27017/TodoApp');

module.exports = {
  mongoose: mongoose
};
