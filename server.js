const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const urlRoutes = require('./routes/url');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/urlshortener';

mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected successfully'))
.catch(err => console.log('MongoDB connection error:', err));

// Add admin routes for local development compatibility (BEFORE url routes)
app.get('/api/admin', async (req, res) => {
    try {
        const Url = require('./models/Url');
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

app.delete('/api/admin', async (req, res) => {
    try {
        const Url = require('./models/Url');
        const { id } = req.query;
        
        if (!id) {
            return res.status(400).json({
                success: false,
                message: 'ID is required'
            });
        }

        const url = await Url.findByIdAndDelete(id);
        
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

// Routes
app.use('/api', urlRoutes);
app.use('/', urlRoutes); // For redirect routes

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, 'client/build')));
    
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
    });
}

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
