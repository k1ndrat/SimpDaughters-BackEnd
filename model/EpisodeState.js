const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const episodeStateSchema = new Schema({
    episode: {
        type: Number,
        required: true,
    },
    season: {
        type: Number,
        required: true,
    },
    user: {
        type: String,
        required: true,
    },
    state: {
        isLiked: {
            type: Boolean,
        },
        isWatched: {
            type: Boolean,
        },
        isForLater: {
            type: Boolean,
        },
    },
    // users: {
    //     whoLiked: {
    //         type: [{ type: String }],
    //         required: false,
    //         default: [],
    //     },
    //     whoWatched: {
    //         type: [{ type: String }],
    //         required: false,
    //         default: [],
    //     },
    //     whoSaved: {
    //         type: [{ type: String }],
    //         required: false,
    //         default: [],
    //     },
    // },
});

module.exports = mongoose.model("EpisodeState", episodeStateSchema);
