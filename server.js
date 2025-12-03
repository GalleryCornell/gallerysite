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
                label TEXT,
                essay TEXT NOT NULL,
                exhibitions JSONB,
                provenance JSONB NOT NULL
            );
        `);

        await db.query(`
            CREATE INDEX IF NOT EXISTS idx_artworks_timestamp
            ON artworks(timestamp DESC);
        `);

        // Add missing columns if they don't exist (migration)
        try {
            await db.query(`
                ALTER TABLE artworks
                ADD COLUMN IF NOT EXISTS label TEXT,
                ADD COLUMN IF NOT EXISTS exhibitions JSONB;
            `);
            console.log('Database schema updated successfully');
        } catch (error) {
            console.log('Schema migration skipped (columns may already exist):', error.message);
        }

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
                year: row.year.toString(),  // Ensure year is string
                medium: row.medium,
                label: row.label || 'This work interrogates the phenomenology of contemporary practice.',
                critique: row.essay,  // Map essay to critique for frontend
                exhibitions: row.exhibitions || [
                    "'Recent Works,' Contemporary Gallery (2023)",
                    "'New Acquisitions,' Museum of Modern Art (2024)"
                ],
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
            `INSERT INTO artworks (image_url, title, artist, year, medium, label, essay, exhibitions, provenance)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
             RETURNING *`,
            [
                imageUrl,
                critique.title,
                critique.artist,
                critique.year,
                critique.medium,
                critique.label || '',
                critique.critique,
                JSON.stringify(critique.exhibitions || []),
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

// DELETE /api/archive/:id - Delete individual artwork
app.delete('/api/archive/:id', async (req, res) => {
    try {
        const { id } = req.params;

        // Get the image URL before deleting
        const result = await db.query('SELECT image_url FROM artworks WHERE id = $1', [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Artwork not found' });
        }

        // Delete image from Cloudinary
        await deleteImage(result.rows[0].image_url);

        // Delete record from database
        await db.query('DELETE FROM artworks WHERE id = $1', [id]);

        res.json({ success: true, message: 'Artwork deleted' });
    } catch (error) {
        console.error('Error deleting artwork:', error);
        res.status(500).json({ error: 'Failed to delete artwork' });
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
