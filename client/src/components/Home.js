import React, { useState } from 'react';
import axios from 'axios';
import './Home.css';

const Home = () => {
    const [originalUrl, setOriginalUrl] = useState('');
    const [shortUrl, setShortUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [copied, setCopied] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!originalUrl) {
            setError('Please enter a URL');
            return;
        }

        setLoading(true);
        setError('');
        setShortUrl('');

        try {
            const response = await axios.post('/api/shorten', {
                originalUrl
            });

            if (response.data.success) {
                setShortUrl(response.data.data.shortUrl);
            } else {
                setError('Failed to shorten URL');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Error shortening URL');
        } finally {
            setLoading(false);
        }
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(shortUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleReset = () => {
        setOriginalUrl('');
        setShortUrl('');
        setError('');
        setCopied(false);
    };

    return (
        <div className="home-container">
            <div className="home-card">
                <h1>URL Shortener</h1>
                <p>Transform your long URLs into short, shareable links</p>
                
                <form onSubmit={handleSubmit} className="url-form">
                    <div className="input-group">
                        <input
                            type="url"
                            value={originalUrl}
                            onChange={(e) => setOriginalUrl(e.target.value)}
                            placeholder="Enter your long URL here..."
                            className="url-input"
                            required
                        />
                        <button
                            type="submit"
                            disabled={loading}
                            className="submit-btn"
                        >
                            {loading ? 'Shortening...' : 'Shorten URL'}
                        </button>
                    </div>
                </form>

                {error && (
                    <div className="error-message">
                        {error}
                    </div>
                )}

                {shortUrl && (
                    <div className="result-container">
                        <h3>Your shortened URL:</h3>
                        <div className="result-group">
                            <input
                                type="text"
                                value={shortUrl}
                                readOnly
                                className="result-input"
                            />
                            <button
                                onClick={copyToClipboard}
                                className="copy-btn"
                            >
                                {copied ? '✓ Copied!' : '📋 Copy'}
                            </button>
                        </div>
                        <div className="result-actions">
                            <a 
                                href={shortUrl} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="test-link"
                            >
                                Test Link
                            </a>
                            <button onClick={handleReset} className="reset-btn">
                                Create Another
                            </button>
                        </div>
                    </div>
                )}

                <div className="features">
                    <h3>Features</h3>
                    <ul>
                        <li>✅ Instant URL shortening</li>
                        <li>✅ Click tracking</li>
                        <li>✅ Permanent redirects</li>
                        <li>✅ Admin dashboard</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default Home;
