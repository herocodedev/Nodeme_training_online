const mongoose = require('mongoose');
async function connect() {
    try {
        await mongoose.connect('mongodb+srv://admin:123456789abc@vietnam.wwbzq.mongodb.net/test', { useNewUrlParser: true });
        console.log('Connect Success!')
    } catch (err) {
        console.log('Connect Fail!')
    }

}

module.exports = { connect }