const express = require("express");
const router = express.Router();
const {
    handleNewEpisode,
    getAllEpisodes,
    deleteAllEpisodes,
    uploadEpisodes,
} = require("../../controllers/episodesController");

router
    .get("/", getAllEpisodes)
    .post("/", handleNewEpisode)
    .delete("/", deleteAllEpisodes)
    .post("/upload", uploadEpisodes);

module.exports = router;
