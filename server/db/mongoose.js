require('./database.js');

const mongoose = require('mongoose');


mongoose.Promise = global.Promise;
mongoose.connect(process.env.mongoURI).then(() => {
console.log("Connected to mlab database", process.env)
}).catch((err) => {
  console.log(err);
});


module.exports = {
  mongoose: mongoose
};
