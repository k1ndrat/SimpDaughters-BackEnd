const usersDB = {
    users: require("../model/users.json"),
    setUsers: function (data) {
        this.users = data;
    },
};

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const fsPromises = require("fs").promises;
const path = require("path");

const handleLogin = async (req, res) => {
    const { user, pwd } = req.body;

    if (!user || !pwd) {
        return res
            .status(400)
            .json({ message: "Username and password are required!" });
    }

    const foundUser = usersDB.users.find((person) => person.username === user);

    if (!foundUser) {
        return res.sendStatus(401); // Unauthorized
    }

    const match = await bcrypt.compare(pwd, foundUser.password);

    if (match) {
        const accessToken = jwt.sign(
            { username: foundUser.username },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: "15m" }
        );
        const refreshToken = jwt.sign(
            { username: foundUser.username },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: "1w" }
        );

        const otherUsers = usersDB.users.filter(
            (person) => person.username !== foundUser.username
        );

        const currentUser = { ...foundUser, refreshToken };
        usersDB.setUsers([...otherUsers, currentUser]);

        await fsPromises.writeFile(
            path.join(__dirname, "..", "model", "users.json"),
            JSON.stringify(usersDB.users)
        );

        res.cookie("jwt", refreshToken, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000,
        });

        res.json({
            user: foundUser.username,
            accessToken,
        });
    } else {
        res.sendStatus(401);
    }
};

const logout = (req, res) => {
    const cookies = req.cookies;
    if (!cookies?.jwt) return res.sendStatus(204); //No content
    res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: true });
    res.json({ message: "Cookie cleared" });
};

const handleRefreshToken = async (req, res) => {
    const cookies = req.cookies;

    // console.log("cookies", cookies);
    if (!cookies.jwt) {
        return res.sendStatus(401);
    }

    const refreshToken = cookies.jwt;

    const foundUser = usersDB.users.find(
        (person) => person.refreshToken === refreshToken
    );

    if (!foundUser) {
        return res.sendStatus(403); // Forbidden
    }

    // evaluate jwt
    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        (err, decoded) => {
            // console.log("decoded", decoded);
            // console.log("decoded.username", decoded.username);
            if (err || foundUser.username !== decoded.username)
                return res.sendStatus(403); // Forbidden

            const accessToken = jwt.sign(
                { username: decoded.username },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: "15m" }
            );

            res.json({ accessToken, user: foundUser.username });
        }
    );
};

module.exports = { handleLogin, logout, handleRefreshToken };
