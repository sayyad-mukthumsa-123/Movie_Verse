const express = require("express");
const { resetPassword } = require("../controllers/resetPasswordController");

const router = express.Router();

router.put("/reset-password", resetPassword);

module.exports = router;
