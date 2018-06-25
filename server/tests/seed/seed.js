const jwt = require('jsonwebtoken');

const {ObjectID} = require('mongodb');
const {Todo} = require('./../../models/todo.js');
const {User} = require('./../../models/user.js');

const userOneId = new ObjectID();
const userTwoId = new ObjectID();

const users = [{
  _id: userOneId,
  email: 'r.nitya@iitg.ac.in',
  password: 'userOnePass',
  tokens: [{
    access: 'auth',
    token: jwt.sign({_id: userOneId, access: 'auth'}, 'abc123').toString()
  }]
}, {
  _id: userTwoId,
  email: 'nitya@iitg.ac.in',
  password: 'userTwoPass',
}];

const todos  = [{
  _id: new ObjectID(),
  text: "First text todo"
}, {
  _id: new ObjectID(),
  text: "Second text todo",
  complete: true,
  completed: 3342
}];

const populateTodos = (done) => {
  Todo.remove({}).then(() => {
    return Todo.insertMany(todos);

  }).then(() => done()).catch((e) => done(e));
};

const populateUsers = (done) => {
  User.remove({}).then(() => {
    var userOne = new User(users[0]).save();
    var userTwo = new User(users[1]).save();

    return Promise.all([userOne, userTwo])
  }).then(() => done()).catch((e) => done(e));
};

module.exports = {
  todos,
  users,
  populateTodos,
  populateUsers
};
