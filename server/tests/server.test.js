const  expect = require('expect');
const request = require('supertest');

const {ObjectID} = require('mongodb');
const {app} = require('./../server.js');
const {Todo} = require('./../models/todo.js');
const {User} = require('./../models/user.js');
const {todos, populateTodos, users, populateUsers} = require('./seed/seed.js');


beforeEach(populateUsers);
beforeEach(populateTodos);

describe('POST /todos', () => {
  it('Should create a new todo', (done) => {
    var text = 'Test todo text';

    request(app)
      .post('/todos')
      .send({text})
      .expect(200)
      .expect((res) => {
        expect(res.body.text).toBe(text);
      })
      .end((err, res) => {
        if(err)
          return done(err);

        Todo.find().then((todos) => {
          expect(todos.length).toBe(3);
          // expect(todos[0].text).toBe(text);
          done();
        }).catch((e) => done(e));
      });
  });
});

describe('GET /todos', () => {
  it('Should return all node', (done) => {
    request(app)
      .get('/todos')
      .expect(200)
      .expect((res) => {
        expect(res.body.todos.length).toBe(2);
      })
      .end(done);
  });
});


describe('GET /todo/:id', () => {
  it('Should return todo', (done) => {
      request(app)
        .get('/todos/' + todos[0]._id.toHexString())
        .expect(200)
        .expect((res) => {
          expect(res.body.todo.text).toBe(todos[0].text);
        })
        .end(done);
  });
});

describe('DELETE /todo/:id', () => {
  it('Should delete todo', (done) => {

    var hexId = todos[1]._id.toHexString();

    request(app)
      .delete('/todos/' + hexId)
      .expect(200)
      .expect((res) => {
        expect(res.body.todo._id).toBe(hexId);
      })
      .end((err, res) => {
        if(err) {
          return done(err);
        }

        Todo.findById(hexId).then((todo) => {
          // expect(todo).toNotExist();
          done();
        }).catch((e) => {
          done(e);
        });
      });
  });

  it('Should return 404 if todo not found', (done) => {
    var hexId = new ObjectID().toHexString();

    request(app)
      .delete('/todos/' + hexId)
      .expect(404)
      .end(done);
  });

  it('Should return 404 if object id is invalid', (done) => {
    var hexId = new ObjectID().toHexString();

    request(app)
      .delete('/todos/' + hexId)
      .expect(404)
      .end(done);
  });
});

describe('PATCH /todos/:id', () => {
  it('Should patch', (done) => {
    var hexId = todos[0]._id.toHexString();
    var text = 'Should update the text';

    request(app)
      .patch('/todos/'+hexId)
      .expect(200)
      .send({
        complete : true,
        text: text
      })
      .expect((res) => {
        expect(res.body.todo.text).toBe(text);
        expect(res.body.todo.complete).toBe(true);
        expect(typeof res.body.todo.completed).toBe('number');
      })
      .end(done);
  });

  it('Should clear completed ', (done) => {
    var hexId = todos[1]._id.toHexString();
    var text = 'Should update the text and complete';

    request(app)
      .patch('/todos/'+hexId)
      .expect(200)
      .send({
        complete : false,
        text: text
      })
      .expect((res) => {
        expect(res.body.todo.text).toBe(text);
        expect(res.body.todo.complete).toBe(false);
        // expect(res.body.todo.completed).toNotBeTruthy();
      })
      .end(done);
  });

});

describe('GET /users/me', () => {
  it('Should return user if authenticated', (done) => {
    request(app)
      .get('/user/me')
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .expect((res) => {
        expect(res.body._id).toBe(users[0]._id.toHexString());
        expect(res.body.email).toBe(users[0].email);
      })
      .end(done);

  });

  it('Should return 401 if not authenticated', (done) => {
    request(app)
      .get('/user/me')
      .expect(401)
      .expect((res) => {
        expect(res.body).toEqual({});
      })
      .end(done);
  });
});

describe('POST /users', () => {
  it('Should valdate user', (done) => {
    var email = 'xyz@gmail.com';
    var password = '12345678';

    request(app)
      .post('/users')
      .send({email, password})
      .expect(200)
      .expect((res) => {
        expect(res.headers['x-auth']).toBeTruthy();
        expect(res.body._id).toBeTruthy();
        expect(res.body.email).toBe(email);
      })
      .end((err) => {
        if(err) {
          return done(err);
        }

        User.findOne({email}).then((user) => {
          expect(user).toBeTruthy();
          expect(user.password).not.toBe(password);
          done();
        });
      });
  });

  it('Should return validation errors if request invalid', (done) => {
    request(app)
      .post('/users')
      .send({
        email: 'and@gnail.com',
        password: '12345'
      })
      .expect(400)
      .end(done);
  });

  it('Should not create user when email is in use', (done) => {
    request(app)
      .post('/users')
      .send({
        email: users[0].email,
        password: 'ppaswwd'
      })
      .expect(400)
      .end(done);
  });
});
