const express = require('express');
const cors = require('cors');
const db = require('./db');
const { uploadImage, deleteImage } = require('./cloudinary-config');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.static(__dirname));

// Initialize database table
async function initializeDatabase() {
    try {
        await db.query(`
            CREATE TABLE IF NOT EXISTS artworks (
                id SERIAL PRIMARY KEY,
                timestamp TIMESTAMP DEFAULT NOW(),
                image_url TEXT NOT NULL,
                title TEXT NOT NULL,
                artist TEXT NOT NULL,
                year INTEGER NOT NULL,
                medium TEXT NOT NULL,
                essay TEXT NOT NULL,
                provenance JSONB NOT NULL
            );
        `);

        await db.query(`
            CREATE INDEX IF NOT EXISTS idx_artworks_timestamp
            ON artworks(timestamp DESC);
        `);

        console.log('Database initialized successfully');
    } catch (error) {
        console.error('Error initializing database:', error);
    }
}

// GET /api/archive - Retrieve all archived artworks
app.get('/api/archive', async (req, res) => {
    try {
        const result = await db.query(
            'SELECT * FROM artworks ORDER BY timestamp DESC'
        );

        // Transform database rows to match frontend format
        const archive = result.rows.map(row => ({
            id: row.id.toString(),
            timestamp: row.timestamp.toISOString(),
            image: row.image_url,
            critique: {
                title: row.title,
                artist: row.artist,
                year: row.year,
                medium: row.medium,
                essay: row.essay,
                provenance: row.provenance
            }
        }));

        res.json(archive);
    } catch (error) {
        console.error('Error reading archive:', error);
        res.status(500).json({ error: 'Failed to read archive' });
    }
});

// POST /api/archive - Save new artwork
app.post('/api/archive', async (req, res) => {
    try {
        const { image, critique } = req.body;

        if (!image || !critique) {
            return res.status(400).json({ error: 'Missing image or critique data' });
        }

        // Upload image to Cloudinary
        const imageUrl = await uploadImage(image);

        // Save to database
        const result = await db.query(
            `INSERT INTO artworks (image_url, title, artist, year, medium, essay, provenance)
             VALUES ($1, $2, $3, $4, $5, $6, $7)
             RETURNING *`,
            [
                imageUrl,
                critique.title,
                critique.artist,
                critique.year,
                critique.medium,
                critique.essay,
                JSON.stringify(critique.provenance)
            ]
        );

        const entry = {
            id: result.rows[0].id.toString(),
            timestamp: result.rows[0].timestamp.toISOString(),
            image: imageUrl,
            critique: critique
        };

        res.json({ success: true, entry });
    } catch (error) {
        console.error('Error saving to archive:', error);
        res.status(500).json({ error: 'Failed to save to archive' });
    }
});

// DELETE /api/archive/clear - Clear all artworks
app.delete('/api/archive/clear', async (req, res) => {
    try {
        // Get all image URLs before deleting
        const result = await db.query('SELECT image_url FROM artworks');

        // Delete all images from Cloudinary
        for (const row of result.rows) {
            await deleteImage(row.image_url);
        }

        // Delete all records from database
        await db.query('DELETE FROM artworks');

        res.json({ success: true, message: 'Archive cleared' });
    } catch (error) {
        console.error('Error clearing archive:', error);
        res.status(500).json({ error: 'Failed to clear archive' });
    }
});

initializeDatabase().then(() => {
    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
    });
});
