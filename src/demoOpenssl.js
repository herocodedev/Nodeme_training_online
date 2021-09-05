/*node src/demoOpenssl.js*/
var jwt = require('jsonwebtoken');
var fs = require('fs')
var privateKey = fs.readFileSync('/Nodemy_training/src/key/private.pem');
var token = jwt.sign({ money: '999' }, privateKey, { algorithm: 'RS256' });

var cert = fs.readFileSync('/Nodemy_training/src/key/publickey.crt');
var ketqua = jwt.verify(token, cert, { algorithms: ['RS256'] }, function(err, data) {
    console.log(data)
})

console.log(token)