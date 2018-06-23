const express = require('express');
const bodyParser = require('body-parser');
const _ = require('lodash');


var {ObjectID} = require('mongodb');
var {mongoose} = require('./db/mongoose.js');
var {Todo} = require('./models/todo.js');
var {User} = require('./models/user.js');


var app = express();
const port = process.env.PORT || 3000;

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

app.post('/users', (req, res) => {

  var body = _.pick(req.body, ['email', 'password']);

  var user = new User(body);

  user.save().then(() => {
    return user.generateAuthToken();
    // res.send(doc);
  }).then((token) => {
    res.header('x-auth', token).send(user);
  }).catch((err) => {
    res.status(400).send(err);
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

app.delete('/todos/:id', (req, res) => {
  var id = req.params.id;

  if(!ObjectID.isValid(id)) {
    return res.status(404).send();
  }

  Todo.findByIdAndRemove(id).then((todo) => {
    if(!todo) {
      return res.status(404).send();
    }
    res.send({todo});
  }).catch((err) => {
    res.status(400).send();
  });
});

app.patch('/todos/:id', (req, res) => {
  var id = req.params.id;
  var body = _.pick(req.body, ['text', 'complete']);

  if(!ObjectID.isValid(id)) {
    return res.status(404).send();
  }

  if(_.isBoolean(body.complete) && body.complete) {
    body.completed = new Date().getTime();
  }else {
    body.complete = false;
    body.completed = null;
  }

  Todo.findByIdAndUpdate(id, {$set: body}, {new: true}).then((todo) => {
    if(!todo) {
      return res.status(404).send();
    }

    res.send({todo});
  }).catch((err) => {
    res.status(400).send();
  });

});

app.listen(port, () => {
  console.log('Server up and running at ' + port);
});

module.exports = {
  app
};
