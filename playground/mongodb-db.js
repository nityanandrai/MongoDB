// const MongoClient = require('mongodb').MongoClient;

const {MongoClient, ObjectID} = require('mongodb');


MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, client) => {
  if(err) {
    return console.log('Unble to connect to server');
  }
  console.log('MongoDB Server is up and running at port 27017');
  const  db = client.db('TodoApp');

  // db.collection('Todos').find({complete: true}).toArray().then((docs) => {
  //   console.log('Todos');
  //   console.log(JSON.stringify(docs, undefined, 2));
  // }, (err) => {
  //   console.log('Unable to connect ' + err);
  // });

  // db.collection('Todos').find().count().then((count) => {
  //   console.log('Todo count ' + count);
  // }, (err) => {
  //   if(err)
  //     console.log('Unable to connect ' + err);
  // });

  db.collection('Users').find({name: 'Jason Bourne'}).toArray().then((docs) => {
    console.log('Todo list with name Jason Bourne ->');
    console.log(JSON.stringify(docs, undefined, 2));
  }, (err) => {
    if(err)
      console.log('Unable to connect ' + err);
  });

  client.close();
});
