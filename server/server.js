// require('./config/config.js')


const express = require('express');
const bodyParser = require('body-parser');
const _ = require('lodash');
const {ObjectID} = require('mongodb');

var {mongoose} = require('./db/mongoose.js');
var {Todo} = require('./models/todo.js');
var {User} = require('./models/user.js');
var {authenticate} = require('./middleware/authenticate.js');

var app = express();
const port = process.env.PORT;

app.use(bodyParser.json());

app.post('/todos', authenticate, (req, res) => {
  // console.log(req.body);
  var todo01 = new Todo({
    text: req.body.text,
    _creator: req.user._id
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

  }).then((token) => {
    res.header('x-auth', token).send(user);
  }).catch((err) => {
    res.status(400).send(err);
  });

});


app.get('/user/me', authenticate, (req, res) => {
  res.send(req.user);
});

app.post('/user/login', (req, res) => {
  var body = _.pick(req.body, ['email', 'password']);

  User.findByCredentials(body.email, body.password).then((user) => {
    return user.generateAuthToken().then((token) => {
      res.header('x-auth', token).send(user);
    });
  }).catch((e) => {
    res.status(400).send();
  });

});

app.delete('/user/me/token', authenticate, (req, res) => {
  req.user.removeToken(req.token).then(() => {
    res.status(200).send();
  }, () => {
    res.status(400).send();
  })
});

app.get('/todos', authenticate, (req, res) => {
  Todo.find({
    _creator: req.user._id
  }).then((todos) => {
    res.send({todos});
  }, (err) => {
    res.status(400).send();
  });
});

app.get('/todos/:id', authenticate, (req, res) => {
  // res.send(req.params);
  var id = req.params.id;

  if(!ObjectID.isValid(id))
    return res.status(404).send();

  Todo.findOne({
    _id: id,
    _creator: req.user._id
  }).then((todo) => {
    if(!todo)
      return res.status(404).send();
    res.send({todo});
  }, (e) => {
    res.status(400).send();
  });
});

app.delete('/todos/:id', authenticate, (req, res) => {
  var id = req.params.id;

  if(!ObjectID.isValid(id)) {
    return res.status(404).send();
  }

  Todo.findOneAndRemove({
    _id: id,
    _creator: req.user._id
  }).then((todo) => {
    if(!todo) {
      return res.status(404).send();
    }
    res.send({todo});
  }).catch((err) => {
    res.status(400).send();
  });
});

app.patch('/todos/:id', authenticate, (req, res) => {
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

  Todo.findOneAndUpdate({
    _id: id,
    _creator: req.user._id
  },
  {
    $set: body
  },
  {
    new: true
  }).then((todo) => {
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
