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

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({
            success: false,
            message: 'Method not allowed'
        });
    }

    try {
        await dbConnect();

        const { code } = req.query;

        if (!code) {
            return res.status(400).json({
                success: false,
                message: 'URL code is required'
            });
        }

        const url = await Url.findOne({ urlCode: code });

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
}
