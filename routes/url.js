const express = require('express');
const validUrl = require('valid-url');
const shortid = require('shortid');
const Url = require('../models/Url');

const router = express.Router();

// @route   POST /api/shorten
// @desc    Create short URL
router.post('/shorten', async (req, res) => {
    const { originalUrl } = req.body;
    const baseUrl = process.env.BASE_URL || 'http://localhost:5000';

    // Check if originalUrl is valid
    if (!validUrl.isUri(originalUrl)) {
        return res.status(401).json({
            success: false,
            message: 'Invalid URL'
        });
    }

    try {
        // Check if URL already exists
        let url = await Url.findOne({ originalUrl });

        if (url) {
            return res.json({
                success: true,
                data: url
            });
        }

        // Generate short code
        const urlCode = shortid.generate();

        // Create short URL
        const shortUrl = `${baseUrl}/${urlCode}`;

        // Create new URL document
        url = new Url({
            originalUrl,
            shortUrl,
            urlCode
        });

        await url.save();

        res.json({
            success: true,
            data: url
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

// @route   GET /:code
// @desc    Redirect to original URL
router.get('/:code', async (req, res) => {
    try {
        const url = await Url.findOne({ urlCode: req.params.code });

        if (url) {
            // Update click count and last accessed time
            url.clickCount += 1;
            url.lastAccessed = new Date();
            await url.save();

            return res.redirect(url.originalUrl);
        } else {
            return res.status(404).json({
                success: false,
                message: 'URL not found'
            });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

// @route   GET /api/admin/urls
// @desc    Get all URLs (Admin only)
router.get('/admin/urls', async (req, res) => {
    try {
        const urls = await Url.find().sort({ createdAt: -1 });
        res.json({
            success: true,
            data: urls
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

// @route   DELETE /api/admin/urls/:id
// @desc    Delete a URL (Admin only)
router.delete('/admin/urls/:id', async (req, res) => {
    try {
        const url = await Url.findByIdAndDelete(req.params.id);
        
        if (!url) {
            return res.status(404).json({
                success: false,
                message: 'URL not found'
            });
        }

        res.json({
            success: true,
            message: 'URL deleted successfully'
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

module.exports = router;
