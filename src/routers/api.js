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

router.get("/v1/health", healthController.getHealth);

router.get("/v1/users", authMiddleware, userController.getUsers);
router.post("/v1/users/register", userController.registerUser);
router.post("/v1/users/login", userController.loginUser);
// router.get("/v1/protected", authMiddleware, userController.auth);

router.get("/v1/menu", authMiddleware, menuController.getMenu);
router.post("/v1/menu", authMiddleware, menuController.createMenu);
router.delete("/v1/menu", authMiddleware, menuController.clearMenu);

router.post("/v1/cart", authMiddleware, cartController.addItemToCart);
router.get("/v1/cart/:userId", authMiddleware, cartController.getUserCart);
router.delete("/v1/cart", authMiddleware, cartController.deleteItemFromCart);
router.patch("/v1/cart/add", authMiddleware, cartController.increaseQuantityOfItemInCart);
router.patch("/v1/cart/subtract", authMiddleware, cartController.decreaseQuantityOfItemInCart);

router.post("/v1/order/:userId", authMiddleware, orderController.placeOrder);
router.get("/v1/order/", authMiddleware, orderController.getOrders);
router.delete("/v1/order/:orderId", authMiddleware, orderController.deleteOrder);

router.post("/v1/order/place/:orderId", authMiddleware,paymentController.checkoutOrder);
router.post("/v1/payment", authMiddleware, paymentController.createPayment);
router.post("/v1/payment/confirmation", paymentController.sendReciept3);
router.post("/v1/payment/test", paymentController.test);
module.exports = router
