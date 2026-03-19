const express = require("express");
const router = express.Router();

const { createUser, getUserById, loginUser } = require("../controllers/user");
const { createUserValidator, loginValidator } = require("../validators/user");
const validate = require("../middleware/validate");
const auth = require("../middleware/authMiddleware");

router.post("/users", createUserValidator, validate, createUser);
router.post("/login", loginValidator, validate, loginUser);
router.get("/users/:id", auth, getUserById);

module.exports = router;
