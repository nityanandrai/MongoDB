const  expect = require('expect');
const request = require('supertest');

const {ObjectID} = require('mongodb');
const {app} = require('./../server.js');
const {Todo} = require('./../models/todo.js');

const todos  = [{
  _id: new ObjectID(),
  text: "First text todo"
}, {
  _id: new ObjectID(),
  text: "Second text todo",
  complete: true,
  completed: 3342
}];


beforeEach((done) => {
  Todo.remove({}).then(() => {
    return Todo.insertMany(todos);

  }).then(() => done());
});

debugger;

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
