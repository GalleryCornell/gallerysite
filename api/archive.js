const { Pool } = require('pg');
const cloudinary = require('cloudinary').v2;

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Create PostgreSQL connection pool
const pool = new Pool({
    connectionString: process.env.POSTGRES_URL,
    ssl: { rejectUnauthorized: false }
});

// Upload image to Cloudinary
async function uploadImage(base64Image) {
    try {
        const result = await cloudinary.uploader.upload(base64Image, {
            folder: 'faux-critic-archive',
            resource_type: 'auto'
        });
        return result.secure_url;
    } catch (error) {
        console.error('Error uploading to Cloudinary:', error);
        throw error;
    }
}

// Delete image from Cloudinary
async function deleteImage(imageUrl) {
    try {
        const parts = imageUrl.split('/');
        const filename = parts[parts.length - 1].split('.')[0];
        const folder = parts[parts.length - 2];
        const publicId = `${folder}/${filename}`;
        await cloudinary.uploader.destroy(publicId);
    } catch (error) {
        console.error('Error deleting from Cloudinary:', error);
    }
}

module.exports = async (req, res) => {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    try {
        // Ensure table exists
        await pool.query(`
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

        // GET - Retrieve all artworks
        if (req.method === 'GET') {
            const result = await pool.query(
                'SELECT * FROM artworks ORDER BY timestamp DESC'
            );

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

            return res.status(200).json(archive);
        }

        // POST - Save new artwork
        if (req.method === 'POST') {
            const { image, critique } = req.body;

            if (!image || !critique) {
                return res.status(400).json({ error: 'Missing image or critique data' });
            }

            // Upload image to Cloudinary
            const imageUrl = await uploadImage(image);

            // Save to database
            const result = await pool.query(
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

            return res.status(200).json({ success: true, entry });
        }

        // DELETE - Clear all artworks
        if (req.method === 'DELETE') {
            // Get all image URLs before deleting
            const result = await pool.query('SELECT image_url FROM artworks');

            // Delete all images from Cloudinary
            for (const row of result.rows) {
                await deleteImage(row.image_url);
            }

            // Delete all records from database
            await pool.query('DELETE FROM artworks');

            return res.status(200).json({ success: true, message: 'Archive cleared' });
        }

        return res.status(405).json({ error: 'Method not allowed' });
    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({ error: error.message });
    }
};
