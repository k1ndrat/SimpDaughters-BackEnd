const Episode = require("../model/Episode");
const defaultEpisodes = require("../data/episodes.json");

const handleNewEpisode = async (req, res) => {
    const { episode, season, title, link } = req.body;
    // console.log(req.body);
    if (!episode || !season || !title || !link)
        return res
            .status(400)
            .json({ message: "episode, season, title, link are required" });

    const duplicate = await Episode.findOne({ episode, season }).exec();

    if (duplicate) return res.sendStatus(409); // conflict

    try {
        // store the new episode
        const result = await Episode.create({
            episode,
            season,
            title,
            link,
        });

        // console.log(result);

        res.status(201).json({ success: "New episode was added successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getAllEpisodes = async (req, res) => {
    const result = await Episode.find();

    let niceData = {};
    result.forEach((episode) => {
        if (!niceData[episode.season]) {
            niceData[episode.season] = [];
        }
        niceData[episode.season].push(episode);
    });

    res.status(200).json(niceData);
};

const deleteAllEpisodes = async (req, res) => {
    const result = await Episode.deleteMany({});

    res.status(200).json({
        message: `Deleted ${result.deletedCount} episodes.`,
    });

    console.log(`Deleted ${result.deletedCount} episodes.`);
};

const uploadEpisodes = async (req, res) => {
    try {
        const result = await Episode.insertMany(defaultEpisodes);
        res.status(201).json({ success: "Episodes was upload successfully!" });
        console.log("Episodes was upload successfully!");
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    handleNewEpisode,
    getAllEpisodes,
    deleteAllEpisodes,
    uploadEpisodes,
};
