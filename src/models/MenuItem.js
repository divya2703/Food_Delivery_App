const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const menuItemSchema = Schema({
        itemName: {
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

menuItemSchema.index({itemName: 1});
const MenuItem = mongoose.model('MenuItem', menuItemSchema);

module.exports = MenuItem;