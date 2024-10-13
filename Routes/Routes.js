const express = require('express');
const router = express.Router();
const Webtoon = require('../Schema/WebToon');
const { body, validationResult } = require('express-validator');
const { upload, uploadToCloudinary } = require('../Multer/Multer');
const jwt = require('jsonwebtoken');
const fetchuser = require('../Middleware/Fetchuser');

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

// Route 2: Create a new webtoon (POST /api/webtoons/createwebtoon)
router.post('/createwebtoon', fetchuser, upload.single('image'), [
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

        const creatorId = req.user.id;  
        if (!creatorId) {
            return res.status(400).json({ error: "Creator ID is missing in the token." });
        }

       
        const newWebtoon = new Webtoon({
            title,
            description,
            characters,
            imageUrl,
            createdBy: creatorId
        });

        const savedWebtoon = await newWebtoon.save();

       
        const data = { webtoon: { id: savedWebtoon.id } };
        const authToken = jwt.sign(data, process.env.JWT_SECRETE, { expiresIn: '1h' }); 

        
        return res.json({
            webtoon: savedWebtoon,
            authToken: authToken
        });

    } catch (error) {
        console.error(error.message);
        return res.status(500).send("Internal Server Error");
    }
});


// Route 3: Get a specific webtoon by ID (GET /api/webtoons/getwebtoon/:id)
router.get('/getwebtoon/:id', async (req, res) => {
    try {
        const webtoon = await Webtoon.findById(req.params.id);
        if (!webtoon) {
            return res.status(404).send("Webtoon not found");
        }
        res.json(webtoon);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
});




// Route 4: Update a webtoon (PUT /api/webtoons/updatewebtoon/:id)
router.put('/updatewebtoon/:id', fetchuser, [
    body('title', 'Title is required and should be at least 3 characters').optional().isLength({ min: 3 }),
    body('description', 'Description must be at least 5 characters').optional().isLength({ min: 5 }),
    body('characters', 'Characters array is required').optional().isArray()
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { title, description, characters } = req.body;

        let webtoon = await Webtoon.findById(req.params.id);
        if (!webtoon) {
            return res.status(404).send("Webtoon not found");
        }

        
        if (webtoon.createdBy.toString() !== req.user.id) {  
            return res.status(403).json({ error: "User not authorized to update this webtoon" });
        }

        const updatedWebtoon = {};
        if (title !== undefined) updatedWebtoon.title = title;
        if (description !== undefined) updatedWebtoon.description = description;
        if (characters !== undefined) updatedWebtoon.characters = characters;

        webtoon = await Webtoon.findByIdAndUpdate(req.params.id, { $set: updatedWebtoon }, { new: true });

        res.json({ webtoon });

    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
});


// Route 5: Delete a webtoon (DELETE /api/webtoons/deletewebtoon/:id)
router.delete('/deletewebtoon/:id', fetchuser, async (req, res) => {
    try {
        let webtoon = await Webtoon.findById(req.params.id);
        if (!webtoon) {
            return res.status(404).json({ error: "Webtoon not found" });
        }

      
        if (webtoon.createdBy.toString() !== req.user.id) {
            return res.status(403).json({ error: "User not authorized to delete this webtoon" });
        }

       
        await Webtoon.findByIdAndDelete(req.params.id);

        res.json({ success: "Webtoon has been deleted", webtoon });
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
});


module.exports = router;
