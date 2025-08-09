# URL Shortener - Serverless Deployment Guide

This project has been restructured for serverless deployment on Vercel.

## Project Structure

```
/
├── api/                    # Serverless functions
│   ├── shorten.js         # POST /api/shorten
│   ├── admin.js           # GET/DELETE /api/admin
│   └── [code].js          # GET /[code] (redirect)
├── client/                # React frontend
└── vercel.json            # Vercel configuration
```

## Deployment Steps

### 1. Environment Variables

Set these environment variables in your Vercel dashboard:

- `MONGODB_URI` - Your MongoDB connection string
- `BASE_URL` - Your Vercel app URL (e.g., `https://your-app.vercel.app`)

### 2. Deploy to Vercel

1. Install Vercel CLI: `npm install -g vercel`
2. Login to Vercel: `vercel login`
3. Deploy: `vercel`
4. Set environment variables in Vercel dashboard
5. Redeploy: `vercel --prod`

### 3. API Endpoints

- **POST** `/api/shorten` - Create short URL
- **GET** `/api/admin` - Get all URLs (admin)
- **DELETE** `/api/admin?id={id}` - Delete URL (admin)
- **GET** `/{code}` - Redirect to original URL

### 4. Features

✅ Serverless architecture  
✅ MongoDB Atlas integration  
✅ React frontend with build optimization  
✅ CORS handling  
✅ URL validation  
✅ Click tracking  
✅ Admin dashboard  

## Local Development

```bash
# Install dependencies
npm install
cd client && npm install

# Start development
npm run dev
```

## Production Build

```bash
# Build for production
npm run build
```

The app will automatically build the React client during Vercel deployment.
