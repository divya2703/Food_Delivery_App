const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const itemSchema = Schema({
        name: {
            type: String,
            unique: true,
            required: true
        },
        price: {
            type: Number,
            required: true
        }
    }, 
    {
        timestamps: true
    }
);


const Item = mongoose.model('Item', itemSchema);
module.exports = Item;