const { Pool } = require('pg');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL || process.env.POSTGRES_URL,
    ssl: { rejectUnauthorized: false }
});

module.exports = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');

    try {
        // Create table if it doesn't exist
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

        await pool.query(`
            CREATE INDEX IF NOT EXISTS idx_artworks_timestamp
            ON artworks(timestamp DESC);
        `);

        return res.status(200).json({
            success: true,
            message: 'Database initialized successfully'
        });
    } catch (error) {
        console.error('Error initializing database:', error);
        return res.status(500).json({
            error: error.message,
            details: error.stack
        });
    }
};
