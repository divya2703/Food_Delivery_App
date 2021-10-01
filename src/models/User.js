const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = Schema({
        name: {
            type: String,
            unique: true,
            required: true,   
        },
        email: {
            type: String,
            unique: true,
            required: true
        },
        hash: {
            type: String,
        },
        salt: {
            type: String
        },
        street_address: {
            type: String,
            required: true
        }
    }, 
    {
        timestamps: true
    }
);

const User = mongoose.model('User', userSchema);
module.exports = User;