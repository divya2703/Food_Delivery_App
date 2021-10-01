const express = require("express");
const router = express.Router();
const passport = require('passport');
const authMiddleware = passport.authenticate('jwt', { session: false });

// controllers
const healthController = require("../controllers/HealthControllers");
const userController = require("../controllers/UserController");
const menuController = require("../controllers/MenuControllers");
const cartController = require("../controllers/CartControllers");
const paymentController = require('../controllers/PaymentController');
const orderController = require('../controllers/OrderControllers');

router.get("/v1/users", userController.getUsers);
router.post("/v1/users/register", userController.registerUser);

router.post("/v1/users/login", userController.loginUser);
router.get("/v1/protected", authMiddleware, userController.auth);

router.get("/v1/health", healthController.getHealth);

router.get("/v1/menu", menuController.getMenu);
router.post("/v1/menu", menuController.createMenu);
router.delete("/v1/menu", menuController.clearMenu);

router.post("/v1/cart", cartController.addItemToCart);
router.get("/v1/cart/:userId", cartController.getUserCart);
// router.patch("/v1/cart", cartController.updateCartItem);
router.delete("/v1/cart", cartController.deleteItemFromCart);
router.patch("/v1/cart/add", cartController.increaseQuantityOfItemInCart);
router.patch("/v1/cart/subtract", cartController.decreaseQuantityOfItemInCart);

router.post("/v1/order/:userId", orderController.createOrder);
router.get("/v1/order/", orderController.getOrders);
router.delete("/v1/order/:orderId", orderController.deleteOrder);
router.post("/v1/payment", paymentController.createPayment);
router.post("/v1/order/place/:orderId", paymentController.placeOrder);
module.exports = router
