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
const data = require('./constants/Menu.json');
Item.collection.insertMany(data, function(err,r) {
    assert.equal(null, err);
    console.log("Insert completed")
})
module.exports = Item;