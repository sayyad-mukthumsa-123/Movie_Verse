const express = require("express");
const { generateAvatars } = require("../controllers/avatarController");

const router = express.Router();

router.get("/avatars", generateAvatars);

module.exports = router;
