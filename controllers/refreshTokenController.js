const usersDB = {
    users: require("../model/users.json"),
    setUsers: function (data) {
        this.users = data;
    },
};

const jwt = require("jsonwebtoken");
require("dotenv").config();

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
                { expiresIn: "30s" }
            );

            res.json({ accessToken });
        }
    );
};

module.exports = { handleRefreshToken };
