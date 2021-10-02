const Order = require('../models/Order');
const Cart = require('../models/CartItem');
const User = require('../models/User');
const mongoose = require('mongoose');
const ObjectId =  mongoose.Types.ObjectId;

const getCartForUserId = async(userId)=>{
    try{
        if(!userId)
            return null;
        const cart = await Cart.find({'userId': userId});
        let totalPrice = 0;

        //calculate totalPrice for the cart
        for(let i=0; i<cart.length; i++){
            totalPrice += (cart[i].totalPrice);
        }
    
        return {
            "finalPrice": totalPrice,
            "cart": cart
        }
    }
    catch(err){
        console.error(err);
    }
    
}

const deleteCartForUserId = async(userId)=>{
    try{
        if(!userId)return null;
        const cart = await Cart.deleteMany({'userId': userId});
        return {
            "msg": `Cart deletion successful for userId ${userId}`
        }
    }
    catch(err){
        console.log(err);
    }
    
}

exports.getOrders= async(req, res)=>{
    try{

        const orders = await Order.aggregate([
            {   
                $sort: {
                    updatedAt: -1,
                }
            },
            {
                $project: {  
                    userId: '$user_id',
                    totalPrice: '$total',
                    orderStatus: '$order_status',
                    email: 1, 
                    shippingAddress: '$shipping_address',
                    orderSummary: '$order_summary',
                    createdAt: 1,
                    updatedAt: 1,
                    
                },
            }
        ])
        res.status(200).send(orders);
    }
    catch(err){
        console.log(err);
        res.status(500).send(err);
    }
    
}

exports.placeOrder = async(req, res) =>{

    try{
        if(!req.params.userId){
            return res.status(400).send("No user with provided userId");
        }
        const userId = ObjectId(req.params.userId);
        const user = await User.findById(userId);
       // console.log("Creating order for "+userId);
        const result = await getCartForUserId(userId);
        if(result.finalPrice>0){
            var newOrder = new Order({
                user_id: userId,
                email: user.email,
                shipping_address: user.street_address,
                order_summary: result.cart,
                total: result.finalPrice
            })
            await newOrder.save();
            //console.log(newOrder)
            await deleteCartForUserId(userId);
            return res.status(201).send({
                id: newOrder._id,
                userId: newOrder.userId,
                orderStatus: newOrder.order_status,
                totalPrice: newOrder.total,
                email: newOrder.email,
                shippingAddress: newOrder.shipping_address,
                orderSummary: newOrder.order_summary,
                createdAt: newOrder.createdAt,
                updatedAt: newOrder.updatedAt

            });
            
        }
        res.status(200).send({"msg": "Cannot create order for the user since cart is empty"}); 
    }
    catch(err){
        console.log(err);
        res.status(500).send(err);
    }
}

exports.deleteOrder = async(req, res) =>{

    try{
        if(!req.params.orderId){
            return res.status(400).send({"msg": "No user with provided orderId"});
            
        }
        const docs = await Order.findByIdAndDelete(req.params.orderId);
        if(docs == null){
            return res.status(400).send({"msg": "No order with provided orderId exists"});
        }
        res.status(200).send({
            "msg": "Deletion successful",
            "Deleted Order": docs
        });
    }
    catch(err){
        res.status(500).send(err);
    }
}