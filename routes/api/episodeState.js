const express = require("express");
const router = express.Router();

const {
    handleEpisodeState,
} = require("../../controllers/episodesStateController");

const verifyJWT = require("../../middleware/verifyJWT");

router.use(verifyJWT);
router.put("/", handleEpisodeState);

module.exports = router;
