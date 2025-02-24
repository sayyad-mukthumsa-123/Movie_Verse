const express = require("express");
const { register, login, getUserId } = require("../controllers/authController");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/get-user-id", getUserId);

module.exports = router;
