var jwt = require('jsonwebtoken');

var data = { user: 'Aloo' }
async function abc() {
    var token = await jwt.sign(data, '123456', function(err, data) {
        console.log(data)
    })
}
abc()
console.log('outline')
    // var decoded = jwt.verify(token, '123456')
    // console.log(decoded)