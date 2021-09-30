const express = require("express");
const router = express.Router();
const passport = require('passport');
const authMiddleware = passport.authenticate('jwt', { session: false });

// controllers
const healthController = require("../controllers/HealthControllers");
const userController = require("../controllers/UserController");

router.get("/v1/users", userController.getUsers);
router.post("/v1/users/register", userController.registerUser);
router.post("/v1/users/login", userController.loginUser);
router.get("/v1/protected", authMiddleware, userController.auth);
router.get("/v1/health", healthController.getHealth);

module.exports = router
