const EpisodeState = require("../model/EpisodeState");
const Episode = require("../model/Episode");

const handleEpisodeState = async (req, res) => {
    const { episode, season, user, state } = req.body;

    if (!episode || !season || !user)
        return res
            .status(400)
            .json({ message: "episode, season, user are required" });

    try {
        const filter = { episode, season, user };
        const updatedEpisodeState = await EpisodeState.findOneAndUpdate(
            filter,
            {
                state,
            },
            { new: true }
        ).exec();

        if (updatedEpisodeState) {
            res.status(200).json({
                success: "The episodeState was updated successfully",
            });
        } else {
            const result = await EpisodeState.create({
                episode,
                season,
                user,
                state,
            });

            console.log(result);

            res.status(201).json({
                success: "New episodeState was added successfully",
            });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getAllEpisodeStates = async (req, res) => {
    const result = await EpisodeState.find();

    res.status(200).json(result);
};

const getEpisodeStatesByUser = async (req, res) => {
    const user = req.params.user;

    const result = await EpisodeState.find({ user }).populate("episode");

    res.status(200).json(result);
};

const getMergedAllEpisodes = async (req, res) => {
    const user = req.params.user;

    const episodes = await Episode.find();
    const episodeStates = await EpisodeState.find({ user });

    const mergedEpisodes = {};

    for (const episode of episodes) {
        const episodeState = episodeStates.find(
            (e) => e.episode === episode.episode && e.season === episode.season
        );

        let mergedEpisode;

        if (episodeState) {
            mergedEpisode = {
                _id: episodeState._id,
                episode: episode.episode,
                season: episode.season,
                title: episode.title,
                link: episode.link,
                state: episodeState.state,
            };
            console.log(mergedEpisode);
        } else {
            mergedEpisode = episode;
        }

        if (!mergedEpisodes[mergedEpisode.season]) {
            mergedEpisodes[mergedEpisode.season] = [];
        }
        mergedEpisodes[mergedEpisode.season].push(mergedEpisode);
    }

    res.status(200).json(mergedEpisodes);
};

module.exports = {
    handleEpisodeState,
    getAllEpisodeStates,
    getEpisodeStatesByUser,
    getMergedAllEpisodes,
};
