const express = require('express');
const router = express.Router();
const Webtoon = require('../Schema/WebToon');
const { body, validationResult } = require('express-validator');
const { upload, uploadToCloudinary } = require('../Multer/Multer');
const jwt = require('jsonwebtoken');

// Route 1: Get all webtoons (GET /api/webtoons/fetchallwebtoons)
router.get('/fetchallwebtoons', async (req, res) => {
    try {
        const webtoons = await Webtoon.find({}).select('title description characters imageUrl createdAt');
        res.json(webtoons);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
});




// Route 2: Add a new webtoon (POST /api/webtoons/createwebtoon) and It also store image in cloudinary
router.post('/createwebtoon', upload.single('image'), [
    body('title', 'Title is required and should be at least 3 characters').isLength({ min: 3 }),
    body('description', 'Description must be at least 5 characters').isLength({ min: 5 }),
    body('characters', 'Characters array is required').isArray()
], async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { title, description, characters } = req.body;


        if (!req.file) {
            return res.status(400).json({ error: "Image file is required." });
        }


        const cloudinaryResult = await uploadToCloudinary(req.file.buffer, `${title}-${Date.now()}`);
        const imageUrl = cloudinaryResult.secure_url;


        const newWebtoon = new Webtoon({
            title,
            description,
            characters,
            imageUrl
        });


        const savedWebtoon = await newWebtoon.save();


        const data = {
            webtoon: {
                id: savedWebtoon.id
            }
        };
        const authToken = jwt.sign(data, process.env.JWT_SECRETE, { expiresIn: '1h' });

        res.json({
            webtoon: savedWebtoon,
            authToken: authToken
        });

    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
});




module.exports = router;