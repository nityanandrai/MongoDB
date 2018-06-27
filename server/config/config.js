var env = process.env.NODE_ENV || 'development';
const db = require('./../db/database.js');

if(env === 'test' || env === 'development') {
  var config = require('./config.json');
  var envConfig = config[env];

  Object.keys(envConfig).forEach((key) => {
    process.env[key] = envConfig[key];
  });
}


// if(env === 'development') {
//   process.env.PORT = 3000;
//   db.mongoURI = 'mongodb://localhost:27017/TodoApp';
// }else if(env === 'test') {
//   process.env.PORT = 3000;
//   db.mongoURI = 'mongodb://localhost:27017/TodoAppTest';
// }
