// Set your secret key. Remember to switch to your live secret key in production.

const MenuItem = require('../models/MenuItem');
const Order = require('../models/Order');
const mongoose = require('mongoose');
const ObjectId =  mongoose.Types.ObjectId;
const ORDER_STATUS = require('../models/constants/OrderStatus');
// See your keys here: https://dashboard.stripe.com/apikeys
const stripe = require('stripe')('sk_test_51JfjUsSIqM3RN0omFCMMBXXVOagQuGrReMo6CiIG6YReKOJ2BK1xEysKfWr2v29mKoOwL26iv1Zm4SxTEDbJltZS00Pg26UY7E');
const axios = require('axios');

exports.placeOrder = async(req, res) => {
	try{
		
		//console.log("Checking out to place order");
		const orderId = ObjectId(req.params.orderId);
		let order = await Order.findById(orderId);
		if(!order){
			return res.status(400).send({"msg": "No order with given orderId"});
		}
		if(order.order_status==ORDER_STATUS.PLACED){
			return res.status(400).send({"msg": "Order already placed"});	
		}
		if(order.order_status!==ORDER_STATUS.PLACED){
			const orderDetails = {
				"amount": order.total,
				"email": order.email
			}
			const result = await axios.post('http://localhost:9001/v1/payment', orderDetails);
			if(result.status==200){
				const docs = await Order.findByIdAndUpdate(orderId, {order_status: ORDER_STATUS.PLACED},{new: true});
				return res.status(200).send({"msg": "successful", "order": docs});
			}
			else{
				return res.status(302).send({"result": result.data});
			}
		}
		
	}
	catch(err){
		res.status(500).send(err);
	}
}

exports.createPayment= async (req, res) => {
	var charged;
	const amount = req.body.amount || 200;
	const email = req.body.email || "divya.kumari@gmail.com";

	try {
		charged = await stripe.paymentIntents.create({
			amount: amount,
			currency: "gbp",
			payment_method_types: ["card"],
			receipt_email: email,
		});
	} 
	catch (err) {
		return res.status(500).send(err);
	}

	try {
		const paymentConfirm = await stripe.paymentIntents.confirm(
			charged.id,
			{ 
				payment_method: "pm_card_in" 
			}
		);
		if(paymentConfirm.client_secret){
			return res.status(200).send({"Status": "Successful", "amount": amount});
		}
		res.status(200).send(generateResponse(paymentConfirm));
	} catch (err) {
		return res.status(500).send(err);
	}
};


const generateResponse = (intent) => {
	// Note that if your API version is before 2019-02-11, 'requires_action'
	// appears as 'requires_source_action'.
	if (intent.status === 'requires_action' && intent.next_action.type === 'use_stripe_sdk') {
		// Tell the client to handle the action
		return {
			requires_action: true,
			payment_intent_client_secret: intent.client_secret
		};
	} 
	else if (intent.status === 'succeeded') {
		// The payment didn’t need any additional actions and completed!
		// Handle post-payment fulfillment
		return {
			success: true
		};
	}
	else {
		// Invalid status
		return {
			error: 'Invalid PaymentIntent status'
		}
	}
};