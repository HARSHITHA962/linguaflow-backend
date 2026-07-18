const express = require("express");
const bcrypt = require("bcryptjs");
const db = require("../db");

const router = express.Router();

// Register
router.post("/register", async (req, res) => {
    const { name, email, password } = req.body;

    const hash = await bcrypt.hash(password, 10);

    db.query(
        "INSERT INTO users(name,email,password) VALUES(?,?,?)",
        [name, email, hash],
        (err) => {
            if (err) return res.status(500).json(err);

            res.json({
                message: "User Registered Successfully"
            });
        }
    );
});

// Login
router.post("/login", (req, res) => {

    const { email, password } = req.body;

    db.query(
        "SELECT * FROM users WHERE email=?",
        [email],
        async (err, result) => {

            if (err) {
                return res.status(500).json(err);
            }

            if (result.length === 0) {
                return res.json({
                    message: "User Not Found"
                });
            }

            const match = await bcrypt.compare(
                password,
                result[0].password
            );

            if (!match) {
                return res.json({
                    message: "Incorrect Password"
                });
            }

            res.json({
                message: "Login Successful",
                user: result[0]
            });

        }
    );

});

module.exports = router;