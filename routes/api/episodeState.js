const express = require("express");
const router = express.Router();

const {
    handleEpisodeState,
    getAllEpisodeStates,
} = require("../../controllers/episodesStateController");

const verifyJWT = require("../../middleware/verifyJWT");

router.use(verifyJWT);
router.get("/", getAllEpisodeStates).put("/", handleEpisodeState);

module.exports = router;
