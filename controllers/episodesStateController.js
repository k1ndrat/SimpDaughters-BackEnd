const EpisodeState = require("../model/EpisodeState");

const handleEpisodeState = async (req, res) => {
    const { episode, season, userId, state } = req.body;

    if (!episode || !season || !userId)
        return res
            .status(400)
            .json({ message: "episode, season, userId are required" });

    try {
        const filter = { episode, season, userId };
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
                userId,
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

module.exports = {
    handleEpisodeState,
};
