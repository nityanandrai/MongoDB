// const MongoClient = require('mongodb').MongoClient;

const {MongoClient, ObjectID} = require('mongodb');


MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, client) => {
  if(err) {
    return console.log('Unble to connect to server');
  }
  console.log('MongoDB Server is up and running at port 27017');
  const  db = client.db('TodoApp');

  db.collection('Users').findOneAndUpdate({
    _id: new ObjectID("5b21e53a9800427bd89748cd")
  }, {
    $inc: {
      age: 1
    },
    $set: {
      name: 'Jason Bourne'
    }
  }, {
    updateOriginal: false
  }).then((result) => {
    console.log(result);
  });

  // db.collection('Todos').findOneAndUpdate({
  //   _id: new ObjectID("5b22a64631aed823e299b676")
  // }, {
  //   $set: {
  //     completed: true
  //   }
  // }, {
  //   returnOriginal: false
  // }).then((result) => {
  //   console.log(result);
  // });

  // client.close();
});
