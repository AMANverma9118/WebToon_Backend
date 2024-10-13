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





module.exports = router;