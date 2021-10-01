const mongoose = require('mongoose');
const ORDER_STATUS = require('./constants/OrderStatus');
const Schema = mongoose.Schema;

const orderSchema = Schema({
        user_id: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: 'User'
        },
        email: {
          type: String,
          required: true ,
          unique: true
        },
        shipping_address: {
            type: String,
            required: true,
            trim: true,
        },
        order_summary: [{
            type: Schema.Types.Mixed,
        }],
        total: {
            type: Number,
            required: true
        },
        order_status: {
            type: String,
            enum: ORDER_STATUS,
            default: ORDER_STATUS.WAITING_FOR_PAYMENT
        }
    }, 
    {
        timestamps: true
    }
);

const Order = mongoose.model('Order', orderSchema);
module.exports = Order;