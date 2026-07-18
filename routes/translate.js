const express = require("express");
const { execFile } = require("child_process");
const db = require("../db");

const router = express.Router();

// =======================================
// Translate and Save History
// =======================================

router.post("/", (req, res) => {

    const { text, source, target, userId } = req.body;

    execFile(
        "python",
        [
            "./python/translate.py",
            text,
            source,
            target
        ],
        (error, stdout) => {

            if (error) {

                console.log(error);

                return res.status(500).json({
                    message: "Translation Failed"
                });

            }

            try {

                const result = JSON.parse(stdout);

                if (result.error) {

                    return res.status(400).json({
                        message: result.error
                    });

                }

                db.query(

                    `INSERT INTO history
                    (user_id,input_text,translated_text,source_lang,target_lang)
                    VALUES(?,?,?,?,?)`,

                    [
                        userId,
                        text,
                        result.translatedText,
                        source,
                        target
                    ],

                    (err) => {

                        if (err) {

                            console.log(err);

                            return res.status(500).json({
                                message: "Database Error"
                            });

                        }

                        res.json({
                            translatedText: result.translatedText
                        });

                    }

                );

            } catch (err) {

                console.log(err);

                res.status(500).json({
                    message: "Invalid Python Response"
                });

            }

        }

    );

});


// =======================================
// Get Logged In User History
// =======================================

router.get("/history/:userId", (req, res) => {

    const { userId } = req.params;

    db.query(

        `SELECT *
         FROM history
         WHERE user_id=?
         ORDER BY created_at DESC`,

        [userId],

        (err, result) => {

            if (err) {

                console.log(err);

                return res.status(500).json({
                    message: "Database Error"
                });

            }

            res.json(result);

        }

    );

});


// =======================================
// Delete Translation History
// =======================================

router.delete("/history/:id", (req, res) => {

    const { id } = req.params;

    console.log("Deleting Translation ID:", id);

    db.query(

        "DELETE FROM history WHERE id = ?",

        [id],

        (err, result) => {

            if (err) {

                console.log(err);

                return res.status(500).json({
                    message: "Delete Failed"
                });

            }

            console.log("Delete Result:", result);

            if (result.affectedRows === 0) {

                return res.status(404).json({
                    message: "Translation Not Found"
                });

            }

            res.json({
                message: "Translation Deleted Successfully"
            });

        }

    );

});


// =======================================
// Dashboard Statistics
// =======================================

router.get("/stats/:userId", (req, res) => {

    const { userId } = req.params;

    db.query(

        `SELECT
            COUNT(*) AS totalTranslations,
            COUNT(DISTINCT target_lang) AS languagesUsed,
            SUM(DATE(created_at)=CURDATE()) AS todayTranslations
         FROM history
         WHERE user_id=?`,

        [userId],

        (err, result) => {

            if (err) {

                console.log(err);

                return res.status(500).json({
                    message: "Database Error"
                });

            }

            res.json(result[0]);

        }

    );

});

module.exports = router;