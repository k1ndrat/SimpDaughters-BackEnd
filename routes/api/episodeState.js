const express = require("express");
const router = express.Router();

const {
    handleEpisodeState,
} = require("../../controllers/episodesStateController");

router.put("/", handleEpisodeState);

module.exports = router;
