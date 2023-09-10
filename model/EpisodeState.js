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
    userId: {
        type: String,
        required: true,
    },
    state: {
        isLiked: {
            type: Boolean,
            required: true,
            default: false,
        },
        isWatched: {
            type: Boolean,
            required: true,
            default: false,
        },
        isForLater: {
            type: Boolean,
            required: true,
            default: false,
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
