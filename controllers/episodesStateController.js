const EpisodeState = require("../model/EpisodeState");

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

module.exports = {
    handleEpisodeState,
    getAllEpisodeStates,
};
