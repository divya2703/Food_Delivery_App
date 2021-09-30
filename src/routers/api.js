const express = require("express");
const router = express.Router();

// controllers
const healthController = require("../controllers/HealthControllers");
const userController = require("../controllers/UserController");

router.get("/v1/health", healthController.getHealth);

module.exports = router
