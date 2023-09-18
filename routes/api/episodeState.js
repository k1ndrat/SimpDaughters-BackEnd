const express = require("express");
const router = express.Router();

const {
    handleEpisodeState,
    getAllEpisodeStates,
    getEpisodeStatesByUser,
    getMergedAllEpisodes,
} = require("../../controllers/episodesStateController");

const verifyJWT = require("../../middleware/verifyJWT");

router.use(verifyJWT);
router
    .get("/", getAllEpisodeStates)
    .get("/:user", getEpisodeStatesByUser)
    .get("/merged/:user", getMergedAllEpisodes)
    .put("/", handleEpisodeState);

module.exports = router;
