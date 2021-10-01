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
        const orders = await Order.find({});
        res.status(200).send(orders);
    }
    catch(err){
        res.status(500).send(err);
    }
    
}

exports.placeOrder = async(req, res) =>{

    try{
        if(!req.params.userId){
            res.status(400).send("No user with provided userId");
            return;
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
            return res.status(201).send(newOrder);
            
        }
        res.status(200).send({"msg": "Cannot create order for the user since cart is empty"}); 
    }
    catch(err){
        res.status(500).send(err);
    }
}

exports.deleteOrder = async(req, res) =>{

    try{
        if(!req.params.orderId){
            return res.status(400).send({"msg": "No user with provided orderId"});
            
        }
        const docs = await Order.findByIdAndDelete(req.params.orderId);
        res.status(200).send({
            "msg": "Deletion successful",
            "Deleted Order": docs
        });
    }
    catch(err){
        res.status(500).send(err);
    }
}