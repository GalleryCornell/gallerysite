const express = require('express');
const cors = require('cors');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const PORT = 3000;
const ARCHIVE_FILE = path.join(__dirname, 'archive.json');

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.static(__dirname));

// Initialize archive file if it doesn't exist
async function initializeArchive() {
    try {
        await fs.access(ARCHIVE_FILE);
    } catch {
        await fs.writeFile(ARCHIVE_FILE, JSON.stringify([], null, 2));
        console.log('Archive file created');
    }
}

// Get all archive entries
app.get('/api/archive', async (req, res) => {
    try {
        const data = await fs.readFile(ARCHIVE_FILE, 'utf8');
        const archive = JSON.parse(data);
        res.json(archive);
    } catch (error) {
        console.error('Error reading archive:', error);
        res.status(500).json({ error: 'Failed to read archive' });
    }
});

// Add new entry to archive
app.post('/api/archive', async (req, res) => {
    try {
        const { image, critique } = req.body;
        
        if (!image || !critique) {
            return res.status(400).json({ error: 'Missing image or critique data' });
        }

        // Read current archive
        const data = await fs.readFile(ARCHIVE_FILE, 'utf8');
        const archive = JSON.parse(data);

        // Create new entry
        const entry = {
            id: Date.now().toString(),
            timestamp: new Date().toISOString(),
            image: image,
            critique: critique
        };

        // Add to archive
        archive.unshift(entry); // Add to beginning

        // Keep archive at reasonable size (max 1000 entries)
        if (archive.length > 1000) {
            archive.pop();
        }

        // Save updated archive
        await fs.writeFile(ARCHIVE_FILE, JSON.stringify(archive, null, 2));

        res.json({ success: true, entry });
    } catch (error) {
        console.error('Error saving to archive:', error);
        res.status(500).json({ error: 'Failed to save to archive' });
    }
});

// Get single entry by ID
app.get('/api/archive/:id', async (req, res) => {
    try {
        const data = await fs.readFile(ARCHIVE_FILE, 'utf8');
        const archive = JSON.parse(data);
        const entry = archive.find(e => e.id === req.params.id);
        
        if (!entry) {
            return res.status(404).json({ error: 'Entry not found' });
        }
        
        res.json(entry);
    } catch (error) {
        console.error('Error reading entry:', error);
        res.status(500).json({ error: 'Failed to read entry' });
    }
});

// Get archive stats
app.get('/api/stats', async (req, res) => {
    try {
        const data = await fs.readFile(ARCHIVE_FILE, 'utf8');
        const archive = JSON.parse(data);
        
        const stats = {
            totalEntries: archive.length,
            artists: [...new Set(archive.map(e => e.critique.artist))],
            years: [...new Set(archive.map(e => e.critique.year))],
            mediums: [...new Set(archive.map(e => e.critique.medium))]
        };
        
        res.json(stats);
    } catch (error) {
        console.error('Error reading stats:', error);
        res.status(500).json({ error: 'Failed to read stats' });
    }
});

// Start server
initializeArchive().then(() => {
    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
        console.log(`Archive API available at http://localhost:${PORT}/api/archive`);
    });
});