const mongoose = require('mongoose');
async function connect() {
    try {
        await mongoose.connect('mongodb://localhost:27017/Users', { useNewUrlParser: true });
        console.log('Connect Success!')
    } catch (err) {
        console.log('Connect Fail!')
    }

}

module.exports = { connect }