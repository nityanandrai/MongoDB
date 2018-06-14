// const MongoClient = require('mongodb').MongoClient;

const {MongoClient, ObjectID} = require('mongodb');

var obj = new ObjectID();

console.log(obj );

var user = {name: 'nitya',
            age: 25
          };
var {name} = user;

console.log(name);

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, client) => {
  if(err) {
    return console.log('Unble to connect to server');
  }
  console.log('MongoDB Server is up and running at port 27017');
  const  db = client.db('TodoApp');

  // db.collection('Todos').insertOne({
  //   text: 'something is going down',
  //   completed: false
  // }, (err,results) => {
  //   if(err) {
  //     return console.log('Unable to insert todo ' + err);
  //   }
  //   console.log(JSON.stringify(results.ops, undefined, 2));
  // });

  // db.collection('Users').insertOne({
  //   name: 'Jason Bourne',
  //   age: 35,
  //   location: 'unkown'
  // }, (err, result) => {
  //   if(err)
  //     return console.log('Unable to insert data ' + err);
  //   console.log(JSON.stringify(result.ops[0]._id.getTimestamp()));
  // });
  //
  client.close();
});
