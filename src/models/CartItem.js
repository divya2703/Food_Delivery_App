const mongoose = require('mongoose');
const Schema  = mongoose.Schema;

const cartItemSchema = Schema({
    userId: {
        type: Schema.Types.ObjectId,
        required: true,
    },
    itemName: {
        type: String,
        trim: true,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    quantity: {
        type: Number,
        default: 1,
    },
    totalPrice: {
        type: Number
    }
})

cartItemSchema.index({userId: 1, itemName: 1});
const CartItem = mongoose.model('CartItem', cartItemSchema );
module.exports = CartItem;