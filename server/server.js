var express = require('express');
var bodyParser = require('body-parser');

var {ObjectID} = require('mongodb');
var {mongoose} = require('./db/mongoose.js');
var {Todo} = require('./models/todo.js');
var {User} = require('./models/user.js');


var app = express();

app.use(bodyParser.json());

app.post('/todos', (req, res) => {
  // console.log(req.body);
  var todo01 = new Todo({
    text: req.body.text
  });

  todo01.save().then((doc) => {
    // console.log(doc);
    res.send(doc);
  }, (e) => {
    // console.log(e);
    res.status(400).send(e);
  });
});


app.get('/todos', (req, res) => {
  Todo.find().then((todos) => {
    res.send({todos});
  }, (err) => {
    res.status(400).send();
  });
});

app.get('/todos/:id', (req, res) => {
  // res.send(req.params);
  var id = req.params.id;

  if(!ObjectID.isValid(id))
    return res.status(404).send();
  Todo.findById(id).then((todo) => {
    if(!todo)
      return res.status(404).send();
    res.send({todo});
  }, (e) => {
    res.status(400).send();
  });
});

app.listen(3000, () => {
  console.log('Server up and running at 3000');
});

module.exports = {
  app
};
