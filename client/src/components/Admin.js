import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Admin.css';

const Admin = () => {
    const [urls, setUrls] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [stats, setStats] = useState({
        totalUrls: 0,
        totalClicks: 0,
        avgClicks: 0
    });

    useEffect(() => {
        fetchUrls();
    }, []);

    const fetchUrls = async () => {
        try {
            setLoading(true);
            const response = await axios.get('/api/admin/urls');
            
            if (response.data.success) {
                const urlData = response.data.data;
                setUrls(urlData);
                
                // Calculate stats
                const totalClicks = urlData.reduce((sum, url) => sum + url.clickCount, 0);
                setStats({
                    totalUrls: urlData.length,
                    totalClicks,
                    avgClicks: urlData.length > 0 ? (totalClicks / urlData.length).toFixed(1) : 0
                });
            }
        } catch (err) {
            setError('Failed to fetch URLs');
            console.error('Error fetching URLs:', err);
        } finally {
            setLoading(false);
        }
    };

    const deleteUrl = async (id) => {
        if (!window.confirm('Are you sure you want to delete this URL?')) {
            return;
        }

        try {
            const response = await axios.delete(`/api/admin/urls/${id}`);
            
            if (response.data.success) {
                fetchUrls(); // Refresh the list
            }
        } catch (err) {
            setError('Failed to delete URL');
            console.error('Error deleting URL:', err);
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleString();
    };

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
    };

    if (loading) {
        return (
            <div className="admin-container">
                <div className="loading">Loading...</div>
            </div>
        );
    }

    return (
        <div className="admin-container">
            <div className="admin-header">
                <h1>📊 Admin Dashboard</h1>
                <button onClick={fetchUrls} className="refresh-btn">
                    🔄 Refresh
                </button>
            </div>

            {error && (
                <div className="error-message">
                    {error}
                </div>
            )}

            <div className="stats-grid">
                <div className="stat-card">
                    <h3>{stats.totalUrls}</h3>
                    <p>Total URLs</p>
                </div>
                <div className="stat-card">
                    <h3>{stats.totalClicks}</h3>
                    <p>Total Clicks</p>
                </div>
                <div className="stat-card">
                    <h3>{stats.avgClicks}</h3>
                    <p>Avg Clicks per URL</p>
                </div>
            </div>

            <div className="urls-section">
                <h2>All Shortened URLs</h2>
                
                {urls.length === 0 ? (
                    <div className="no-urls">
                        <p>No URLs found. Create your first shortened URL!</p>
                    </div>
                ) : (
                    <div className="urls-table-container">
                        <table className="urls-table">
                            <thead>
                                <tr>
                                    <th>Original URL</th>
                                    <th>Short URL</th>
                                    <th>Clicks</th>
                                    <th>Created</th>
                                    <th>Last Accessed</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {urls.map((url) => (
                                    <tr key={url._id}>
                                        <td className="original-url">
                                            <a 
                                                href={url.originalUrl} 
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                                title={url.originalUrl}
                                            >
                                                {url.originalUrl.length > 50 
                                                    ? url.originalUrl.substring(0, 50) + '...' 
                                                    : url.originalUrl}
                                            </a>
                                        </td>
                                        <td className="short-url">
                                            <div className="short-url-container">
                                                <a 
                                                    href={url.shortUrl} 
                                                    target="_blank" 
                                                    rel="noopener noreferrer"
                                                >
                                                    {url.shortUrl}
                                                </a>
                                                <button
                                                    onClick={() => copyToClipboard(url.shortUrl)}
                                                    className="copy-small-btn"
                                                    title="Copy to clipboard"
                                                >
                                                    📋
                                                </button>
                                            </div>
                                        </td>
                                        <td className="click-count">
                                            <span className="click-badge">
                                                {url.clickCount}
                                            </span>
                                        </td>
                                        <td className="date">
                                            {formatDate(url.createdAt)}
                                        </td>
                                        <td className="date">
                                            {url.lastAccessed 
                                                ? formatDate(url.lastAccessed) 
                                                : 'Never'}
                                        </td>
                                        <td className="actions">
                                            <button
                                                onClick={() => deleteUrl(url._id)}
                                                className="delete-btn"
                                                title="Delete URL"
                                            >
                                                🗑️
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Admin;
