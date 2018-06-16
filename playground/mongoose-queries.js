  const {ObjectID} = require('mongodb');

  const {mongoose} = require('./../server/db/mongoose.js');
  const {Todo} = require('./../server/models/todo.js');

  var id = "5b24ee7008e1342f5abbcfd0";

  if(!ObjectID.isValid(id))
    console.log('Id not valid');

  //
  // Todo.find({
  //   _id: id
  // }).then((todos) => {
  //   console.log('Todos ', todos);
  // });
  //
  // Todo.findOne({
  //   _id: id
  // }).then((todo) => {
  //   console.log('Todos ', todo);
  // });


Todo.findById(id).then((tod) => {
  if(tod === null)
    return console.log('ID not found');
  console.log('Todo found : ', tod);
}).catch((e) => console.log(e));
