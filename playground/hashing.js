const {SHA256} = require('crypto-js');
const jwt = require('jsonwebtoken');

var data = {
  id: 4
};

var token = jwt.sign(data, '123abc');

console.log(token);

var decoded = jwt.verify(token, '123abc');

console.log('decoded : ', decoded);
//
// var msg = 'The name is Bond, James Bond';
// var hash = SHA256(msg).toString();
//
// console.log('msg :' + msg + '\nhash: ' + hash);

// var data = {
//   id: 4
// };
//
// var token = {
//   data: data,
//   hash: SHA256(JSON.stringify(data) + 'somesecret').toString()
// }
//
// var resultHash = SHA256(JSON.stringify(token.data) + 'somesecret').toString();
//
// if(resultHash === token.hash) {
//   console.log('User is valid');
// }else {
//   console.log('Use can not be trusted');
// }
