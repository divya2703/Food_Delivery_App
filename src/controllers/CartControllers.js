const CartItem = require('../models/CartItem');
const User = require('../models/User');
const MenuItem = require('../models/MenuItem');

const mongoose = require('mongoose');
const ObjectId =  mongoose.Types.ObjectId;

//helper method
const findItemByUserIdAndItemName = async(userId, itemName)=>{
    try{
        if(!userId || !itemName ){
            console.log(typeof userId);
            console.log("Input format unacceptable")
            return null;
        }
        const item = await CartItem.findOne({userId: userId, itemName: itemName});
        return item;
    }
    catch(err){
        console.log(err);
    }
}

//Adds item to cart, if already exists returns without any change
exports.addItemToCart = async(req, res) => {
	try{

        if(!req.body.itemName || !req.body.userId){
            console.error("itemName, userId required");
            res.status(400).send({"error": "itemName, userId required"});
            return;
        } 

        const itemName =  req.body.itemName;
        const userId = ObjectId(req.body.userId);
        const quantity = req.body.quantity || 1;
        var item = await MenuItem.findOne({ itemName: itemName});
        //console.log("Item found");
        if(!item){
            console.error("Menu item not found for provided itemName");
            res.status(400).send({"error": "Menu item not found for provided itemName"});
            return;
        }
        var user = await User.findOne({_id: userId});

        if(!user){
            res.status(500).send({"error": "No user with userId"});
            return;
        }
        //console.log("User found");
        const itemPrev = await findItemByUserIdAndItemName(userId, itemName);
        if(itemPrev){
            res.status(200).send({"msg":"Cannot add to cart, item already exists for this user."});
        }
        else{
            var cartItem = new CartItem({
                userId: user._id,
                itemName: item.itemName,
                price: item.price,
                quantity: quantity,
                totalPrice: item.price*quantity
            })
            await cartItem.save();
            res.status(200).send(cartItem);
        }
	}
	catch (error) {
        res.status(500).json(error.message || "Internal Server Error");
    }
}

//Get cart of a particular user
exports.getUserCart = async(req, res) => {
	try{

        if(!req.params.userId){
            console.error("userId is required");
            res.status(400).send({"error": "userId is required"});
            return;
        } 

        const userId = ObjectId(req.params.userId);
        console.log(userId);
        var user = await User.findOne({_id: userId});
        //console.log(user);
        if(!user){
            res.status(500).send({"error": "No user with userId"});
            return;
        }
       
        var cartItems = await CartItem.find({userId: user._id});
        //console.log(cartItems);
        res.status(200).send(cartItems);

	}
	catch (error) {
        res.status(500).json(error.message || "Internal Server Error");
    }
}

//delete Item with userId and itemName
exports.deleteItemFromCart = async(req, res) =>{
    try{
        if(!req.body.userId || !req.body.itemName ){
            res.status(400).send("userId, itemName is required");
            return;
        }
        const userId = ObjectId(req.body.userId);
        const itemName = req.body.itemName;

        const deletedItem = await CartItem.findOneAndDelete({userId: userId, itemName: itemName});
        if(deletedItem==null){
            res.status(400).send({
                "msg":"Item with provided details does not exist"});
            return;
        }
        res.status(201).send({
            "msg":"Deletion Successful",
            "deletedItem":deletedItem});

    }
    catch(error){
        res.status(500).send(error);
    }
}

//Increase quantity by one for item with given name and for a particular user
exports.increaseQuantityOfItemInCart = async(req, res) =>{
    try{
        if(!req.body.userId || !req.body.itemName ){
            res.status(400).send("userId, itemName is required");
            return;
        }
        const userId = ObjectId(req.body.userId);
        const itemName = req.body.itemName;
        const item = await findItemByUserIdAndItemName(userId, itemName);
        if(!item){
            res.status(400).send("Item does not exist");
            return;
        }
        // console.log(item);
        const qty = item.quantity;
        CartItem.findOneAndUpdate({userId: userId, itemName: itemName},{quantity: qty+1},{new: true}, function(err, docs){
            if(docs)
                res.status(200).send(docs);
            else if(err){
                res.satus(400).send(err);
            }
        });
        
    }
    catch(error){
        res.status(500).send(error);
    }
}

exports.decreaseQuantityOfItemInCart = async(req, res) =>{
    try{
        if(!req.body.userId || !req.body.itemName ){
            res.status(400).send("userId, itemName is required");
            return;
        }
        const userId = ObjectId(req.body.userId);
        const itemName = req.body.itemName;
        const item = await findItemByUserIdAndItemName(userId, itemName);
        if(!item){
            res.status(400).send("Item does not exist");
            return;
        }
        const qty = item.quantity;
        if(qty===1){
            const deletedItem = await CartItem.findOneAndDelete({userId: userId, itemName: itemName});
            res.status(201).send({"msg":"Deleting item since quantity was 1", "deletedItem": deletedItem});
            return
            
        }
        const updatedItem = await CartItem.findOneAndUpdate({userId: userId, itemName: itemName},{quantity: qty-1},{new: true});
        res.status(201).send(updatedItem);

    }
    catch(error){
        res.status(500).send(error);
    }
}