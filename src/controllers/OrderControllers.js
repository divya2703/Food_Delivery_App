const Order = require('../models/Order');
const Cart = require('../models/CartItem');

const mongoose = require('mongoose');
const User = require('../models/User');
const ObjectId =  mongoose.Types.ObjectId;

const getCartForUserId = async(userId)=>{
    if(!userId)return null;
    const cart = await Cart.find({'userId': userId});
    let totalPrice = 0;
    for(let i=0; i<cart.length; i++){
    //   /  console.log(cart[i].totalPrice);
        totalPrice += (cart[i].totalPrice);
    }
    
    return {
        "finalPrice": totalPrice,
        "cart": cart
    }
}

const deleteCartForUserId = async(userId)=>{
    try{
        if(!userId)return null;
        const cart = await Cart.deleteMany({'userId': userId});
        return {
            "msg": "Deletion successful"
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
    }catch(err){
        res.status(500).send(err);
    }
    
}

exports.createOrder = async(req, res) =>{

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
                shipping_address: user.shipping_address,
                order_summary: result.cart,
                total: result.finalPrice
            })
            await newOrder.save();
            //console.log(newOrder)
            await deleteCartForUserId(userId);
            res.status(201).send(newOrder);
            return;
        }
        res.status(200).send("Cannot create order for the user since cart is empty"); 
    }
    catch(err){
        console.log(err);
        res.status(500).send(err);
    }
}


exports.deleteOrder = async(req, res) =>{

    try{
        if(!req.params.orderId){
            res.status(400).send("No user with provided orderId");
            return;
        }
        const docs = await Order.findByIdAndDelete(req.params.orderId);
        res.status(200).send({"Deleted Order": docs});
    }
    catch(err){
        console.log(err);
        res.status(500).send(err);
    }
}