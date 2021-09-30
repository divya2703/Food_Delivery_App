const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const OrderStatus = require('./constants/OrderStatus');

const orderSchema = Schema({
        user_id: {
            type: Schema.Types.ObjectId,
            require: true,
            ref: 'User'
        },
        
        order_summary: [{
            type: Schema.Types.ObjectId,
            ref: 'Item'
        }],

        total: {
            type: Number,
            require: true
        },

        order_status: {
            enum: OrderStatus,
            default: OrderStatus.WAITING_FOR_PAYMENT
        }
    }, 
    {
        timestamps: true
    }
);

const Order = mongoose.model('Order', orderSchema)
module.exports = Order