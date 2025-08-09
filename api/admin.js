const mongoose = require('mongoose');

// Define Url model inline for serverless function
const urlSchema = new mongoose.Schema({
    originalUrl: {
        type: String,
        required: true
    },
    shortUrl: {
        type: String,
        required: true
    },
    urlCode: {
        type: String,
        required: true,
        unique: true
    },
    clickCount: {
        type: Number,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    lastAccessed: {
        type: Date,
        default: null
    }
});

// Use existing connection or create new one
let Url;
if (mongoose.models.Url) {
    Url = mongoose.models.Url;
} else {
    Url = mongoose.model('Url', urlSchema);
}

// MongoDB connection
let cached = global.mongoose;

if (!cached) {
    cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
    if (cached.conn) {
        return cached.conn;
    }

    if (!cached.promise) {
        const opts = {
            bufferCommands: false,
        };

        const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/urlshortener';
        cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
            return mongoose;
        });
    }
    cached.conn = await cached.promise;
    return cached.conn;
}

module.exports = async function handler(req, res) {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    try {
        await dbConnect();

        if (req.method === 'GET') {
            // Get all URLs (Admin only)
            const urls = await Url.find().sort({ createdAt: -1 });
            return res.json({
                success: true,
                data: urls
            });
        } else if (req.method === 'DELETE') {
            // Delete a URL by ID
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

            return res.json({
                success: true,
                message: 'URL deleted successfully'
            });
        } else {
            return res.status(405).json({
                success: false,
                message: 'Method not allowed'
            });
        }

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
}
