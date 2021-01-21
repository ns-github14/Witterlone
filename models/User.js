const { model, Schema } = require('mongoose');

//provide schema for user
//mongo is schemaless but for providing more security we provide schema
const userSchema = new Schema({
    username: String,
    password: String,
    email: String,
    createdAt: String
});

module.exports = model('User', userSchema);