const express = require('express');
const cors = require('cors');
const cloudinary = require('cloudinary').v2;
const db = require('./db');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.static(__dirname));

// Initialize database table
async function initializeDatabase() {
    try {
        await db.query(`
            CREATE TABLE IF NOT EXISTS archive (
                id SERIAL PRIMARY KEY,
                timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                image TEXT NOT NULL,
                critique JSONB NOT NULL
            )
        `);
        console.log('Database table initialized');
    } catch (error) {
        console.error('Error initializing database:', error);
    }
}

app.get('/api/archive', async (req, res) => {
    try {
        const result = await db.query(
            'SELECT * FROM archive ORDER BY timestamp DESC'
        );

        const archive = result.rows.map(row => ({
            id: row.id.toString(),
            timestamp: row.timestamp,
            image: row.image,
            critique: row.critique
        }));

        res.json(archive);
    } catch (error) {
        console.error('Error reading archive:', error);
        res.status(500).json({ error: 'Failed to read archive' });
    }
});

app.post('/api/archive', async (req, res) => {
    try {
        const { image, critique } = req.body;

        if (!image || !critique) {
            return res.status(400).json({ error: 'Missing image or critique data' });
        }

        // Upload image to Cloudinary
        let imageUrl;
        try {
            const uploadResult = await cloudinary.uploader.upload(image, {
                folder: 'faux-critic',
                resource_type: 'auto'
            });
            imageUrl = uploadResult.secure_url;
            console.log('Image uploaded to Cloudinary:', imageUrl);
        } catch (uploadError) {
            console.error('Cloudinary upload error:', uploadError);
            return res.status(500).json({ error: 'Failed to upload image' });
        }

        // Save to database
        const result = await db.query(
            'INSERT INTO archive (image, critique) VALUES ($1, $2) RETURNING *',
            [imageUrl, critique]
        );

        const entry = {
            id: result.rows[0].id.toString(),
            timestamp: result.rows[0].timestamp,
            image: imageUrl,
            critique: critique
        };

        res.json({ success: true, entry });
    } catch (error) {
        console.error('Error saving to archive:', error);
        res.status(500).json({ error: 'Failed to save to archive' });
    }
});

app.delete('/api/archive/clear', async (req, res) => {
    try {
        await db.query('DELETE FROM archive');
        res.json({ success: true, message: 'Archive cleared' });
    } catch (error) {
        console.error('Error clearing archive:', error);
        res.status(500).json({ error: 'Failed to clear archive' });
    }
});

app.delete('/api/archive/:id', async (req, res) => {
    try {
        await db.query('DELETE FROM archive WHERE id = $1', [req.params.id]);
        res.json({ success: true, message: 'Entry deleted' });
    } catch (error) {
        console.error('Error deleting entry:', error);
        res.status(500).json({ error: 'Failed to delete entry' });
    }
});

initializeDatabase().then(() => {
    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
    });
});