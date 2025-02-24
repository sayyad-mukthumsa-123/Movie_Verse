const express = require("express");
const { getRecommendations } = require("../controllers/recommendationController");

const router = express.Router();

router.get("/:movieId", getRecommendations);

module.exports = router;
