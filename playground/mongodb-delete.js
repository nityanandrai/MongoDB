// const MongoClient = require('mongodb').MongoClient;

const {MongoClient, ObjectID} = require('mongodb');


MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, client) => {
  if(err) {
    return console.log('Unble to connect to server');
  }
  console.log('MongoDB Server is up and running at port 27017');
  const  db = client.db('TodoApp');

  // db.collection('Todos').deleteMany({text: 'fuck off'}).then((result) => {
  //   console.log(result);
  // });

  // db.collection('Todos').deleteOne({text: 'fuck off'}).then((result) => {
  //   console.log(result)
  // });
  //
  // db.collection('Todos').findOneAndDelete({completed: false}).then((result) => {
  //   console.log(result);
  // });
  //
  // db.collection('Users').deleteMany({name: 'Jason Bourne'}).then((result) => {
  //   console.log(result);
  // });

  db.collection('Users').findOneAndDelete({_id: new ObjectID("5b21e51162006f7bae67099b")}).then((result) => {
    console.log(result);
  });

  // client.close();
});
