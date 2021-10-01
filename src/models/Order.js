const mongoose = require('mongoose');
const ORDER_STATUS = require('./constants/OrderStatus');
const Schema = mongoose.Schema;


const orderSchema = Schema({
        user_id: {
            type: Schema.Types.ObjectId,
            require: true,
            ref: 'User'
        },
        email: {
          type: String,
          require: true  
        },
        shipping_address: {
            type: String,
            require: true,
        },
        order_summary: [{
            type: Schema.Types.Mixed,
        }],

        total: {
            type: Number,
            require: true
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