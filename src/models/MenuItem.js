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
        },
        priceId: {
            type: Schema.Types.ObjectId,
            required: true
        }
    }, 
    {
        timestamps: true
    }
);


const MenuItem = mongoose.model('MenuItem', menuItemSchema);

module.exports = MenuItem;