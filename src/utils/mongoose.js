const mongoose = require('mongoose');
const dotenv = require('dotenv')

dotenv.config()

const URI = process.env.DATABASE_URL
async function connect() {
    try {
        await mongoose.connect(URI, { useNewUrlParser: true });
        console.log('Connect Success!')
    } catch (err) {
        console.log('Connect Fail!')
    }

}

module.exports = { connect }