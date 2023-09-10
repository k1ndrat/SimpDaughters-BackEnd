require("dotenv").config();

const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const connectDB = require("./config/dbConn");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const PORT = process.env.PORT || 3500;

const verifyJWT = require("./middleware/verifyJWT");

connectDB();

// Cross Origin Resource Sharing
const whitelist = [
    "http://localhost:" + PORT,
    "https://www.google.com.ua",
    "http://localhost:3000",
];
const corsOptions = {
    origin: (origin, callback) => {
        if (whitelist.indexOf(origin) !== -1 || !origin) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    optionsSuccessStatus: 200,
    credentials: true,
};

app.use(cors(corsOptions));

app.use(express.urlencoded({ extended: false }));

// built-in middleware for json
app.use(express.json());

// middleware for cookies
app.use(cookieParser());

app.use("/register", require("./routes/register"));
app.use("/auth", require("./routes/auth"));
// app.use("/refresh", require("./routes/refresh"));

app.use(verifyJWT);

app.use("/api/episodes", require("./routes/api/episodes"));
app.use("/api/episodestate", require("./routes/api/episodeState"));

app.all("*", (req, res) => {
    res.status(404);
    res.json({ error: "404 Not Found" });
});

mongoose.connection.once("open", () => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
});
