const Order = require('../models/Order');
const ORDER_STATUS = require('../models/constants/OrderStatus');
const mongoose = require('mongoose');
const axios = require('axios');
const ObjectId =  mongoose.Types.ObjectId;
const stripe = require('stripe')('sk_test_51JfjUsSIqM3RN0omFCMMBXXVOagQuGrReMo6CiIG6YReKOJ2BK1xEysKfWr2v29mKoOwL26iv1Zm4SxTEDbJltZS00Pg26UY7E');
var MAILGUN_API_KEY = process.env.MAILGUN_API_KEY;
var DOMAIN = process.env.MAILGUN_DOMAIN;
const CryptoJS = require('crypto-js');
var FormData = require('form-data');

//console.log(DOMAIN)
var mailgun = require('mailgun-js');
const { response } = require('express');
mailgun = mailgun({apiKey: MAILGUN_API_KEY, domain: DOMAIN});

exports.checkoutOrder = async(req, res) => {
	try{
		const token = req.headers.authorization;
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
			
			const result = await axios.post('http://localhost:9001/v1/payment', orderDetails, {
				headers: {
					'Authorization': token
				}
			});
			if(result.status == 200){
				const docs = await Order.findByIdAndUpdate(orderId, {order_status: ORDER_STATUS.PLACED},{new: true});

				//Right now, we're only able to send mail to account with which I have created the mailgun account
				//we can modify this to pass dynamic email address as second parameter
				const resultFromSendEmail = await sendReciept("We're pleased to anounce that your order will be out for delivery soon");  
				if(resultFromSendEmail!=null){
					return res.status(200).send({"msg": "successful", "emailReceipt": "sent", "order": docs});
				}
				else {
					return res.status(200).send({"msg": "successful","emailReceipt": "not sent", "order": docs});
				} 
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

const sendReciept = async(email_text) =>{
	try{
		const DEFAULT_MAIL = 'mathsdivya27@gmail.com';
		console.log("Sending email to: "+ DEFAULT_MAIL);
		email_text = email_text || 'Hurray! Your order is successfully Placed';
		var data = new FormData();
		data.append('from', 'divya@sandboxa6157570cc5f4c75a79b1e79ab9b73a5.mailgun.org\n');
		data.append('to', DEFAULT_MAIL);
		data.append('subject', 'Order Confirmation');
		data.append('text', email_text);
		const URL = 'https://api.mailgun.net/v3/sandboxa6157570cc5f4c75a79b1e79ab9b73a5.mailgun.org/messages';
		var config = {
    		method: 'post',
    		url: URL,
    		headers: { 
    			'Authorization': 'Basic YXBpOmtleS03MDBhN2JkYWMyY2YwZWJiOTJiOGJhZjA0OWRmMzY3MQ==', 
    			...data.getHeaders()
  			},
  			data : data
		};

		const result = await axios(config);
		return result.data;
		
	}
	catch(err){
		console.error(err);
		return null;
	}
}






