# URL Shortener - MERN Stack Application

A full-stack URL shortener application built with MongoDB, Express.js, React, and Node.js.

## Features

### User Features
- ✅ Submit long URLs and get shortened versions
- ✅ Redirect from short URLs to original URLs
- ✅ Copy shortened URLs to clipboard
- ✅ Test links functionality
- ✅ Modern, responsive UI

### Admin Features
- ✅ View all shortened URLs
- ✅ Track click statistics for each URL
- ✅ View creation and last access dates
- ✅ Delete URLs
- ✅ Dashboard with statistics

## Technology Stack

- **Frontend**: React, React Router, Axios
- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose
- **URL Generation**: shortid
- **Validation**: valid-url

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn

## Installation & Setup

### 1. Clone the repository
```bash
cd "C:\Users\HP\Url_shortener"
```

### 2. Install backend dependencies
```bash
npm install
```

### 3. Install frontend dependencies
```bash
cd client
npm install
cd ..
```

### 4. Environment Setup
Create a `.env` file in the root directory:
```
MONGODB_URI=mongodb://localhost:27017/urlshortener
PORT=5000
NODE_ENV=development
BASE_URL=http://localhost:5000
```

### 5. Start MongoDB
Make sure MongoDB is running on your system:
- **Local MongoDB**: Start the MongoDB service
- **MongoDB Atlas**: Update the MONGODB_URI in .env with your Atlas connection string

### 6. Run the application

#### Development Mode (Both frontend and backend)
```bash
npm run dev
```

#### Run backend only
```bash
npm run server
```

#### Run frontend only
```bash
npm run client
```

## Usage

### For Users
1. Navigate to `http://localhost:3000`
2. Enter a long URL in the input field
3. Click "Shorten URL"
4. Copy and share the shortened URL
5. Test the link to verify it works

### For Admins
1. Navigate to `http://localhost:3000/admin`
2. View all shortened URLs and their statistics
3. Monitor click counts and access patterns
4. Delete URLs as needed

## API Endpoints

### User Endpoints
- `POST /api/shorten` - Create a shortened URL
- `GET /:shortcode` - Redirect to original URL

### Admin Endpoints
- `GET /api/admin/urls` - Get all URLs with statistics
- `DELETE /api/admin/urls/:id` - Delete a specific URL

## Project Structure

```
url-shortener/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── Home.js     # Main URL shortening page
│   │   │   ├── Admin.js    # Admin dashboard
│   │   │   └── Navbar.js   # Navigation component
│   │   └── App.js
├── models/
│   └── Url.js             # MongoDB schema
├── routes/
│   └── url.js             # API routes
├── server.js              # Express server
├── package.json
└── .env
```

## Database Schema

```javascript
{
  originalUrl: String,    // The original long URL
  shortUrl: String,       // The complete shortened URL
  urlCode: String,        // The short code identifier
  clickCount: Number,     // Number of times accessed
  createdAt: Date,        // Creation timestamp
  lastAccessed: Date      // Last access timestamp
}
```

## Features in Detail

### URL Shortening
- Validates input URLs
- Generates unique short codes using shortid
- Prevents duplicate entries for same URL
- Returns existing short URL if already exists

### Click Tracking
- Increments click count on each access
- Records last access timestamp
- Provides analytics in admin dashboard

### Admin Dashboard
- Statistics overview (total URLs, total clicks, average clicks)
- Sortable table with all URL data
- Copy to clipboard functionality
- Delete confirmation for safety

## Security Considerations

- Input validation for URLs
- MongoDB injection prevention through Mongoose
- CORS configuration for cross-origin requests
- Environment variables for sensitive data

## Customization

### Changing the Base URL
Update the `BASE_URL` in your `.env` file to match your domain.

### Styling
- CSS files are located in `client/src/components/`
- Global styles in `client/src/App.css`
- Responsive design included

### Database Configuration
- MongoDB connection can be customized in `server.js`
- Schema modifications in `models/Url.js`

## Deployment

### Frontend Build
```bash
cd client
npm run build
```

### Production Environment
Set `NODE_ENV=production` in your environment variables.

## Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Ensure MongoDB is running
   - Check connection string in .env
   - Verify network connectivity for Atlas

2. **Port Already in Use**
   - Change PORT in .env file
   - Kill processes using the port

3. **Frontend Can't Connect to Backend**
   - Verify proxy setting in client/package.json
   - Ensure backend is running on correct port

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.
