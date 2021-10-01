const mongoose = require('mongoose');
const Schema  = mongoose.Schema;

const cartItemSchema = Schema({
    userId: {
        type: Schema.Types.ObjectId,
        require: true,

    },
    itemName: {
        type: String,
        require: true,
    },
    price: {
        type: Number,
        require: true,
    },
    quantity: {
        type: Number,
        default: 1,
    },
    totalPrice: {
        type: Number
    }
})
cartItemSchema.index({userId: 1, itemName: 1}, {unique: true});
const CartItem = mongoose.model('CartItem', cartItemSchema );
module.exports = CartItem;