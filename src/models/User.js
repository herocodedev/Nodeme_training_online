const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const UserSchema = new Schema({
    username: { type: String, required: true },
    password: { type: String },
    role: { type: Number },
    authType: {
        type: String,
        enum: ['google', 'facebook'],
    },
    authFacebookId: { type: String },
    authGoogleId: { type: String },
}, {
    collection: 'Users'
});

module.exports = mongoose.model('Users', UserSchema);