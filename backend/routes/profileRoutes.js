const express = require("express");
const { updateProfile, getProfile } = require("../controllers/profileController");

const router = express.Router();

router.put("/:id", updateProfile);
router.get("/:id", getProfile);

module.exports = router; 
