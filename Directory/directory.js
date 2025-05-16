const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

// Serve clinics.json data
router.get('/api/clinics', (req, res) => {
    const clinicsPath = path.join(__dirname, 'clinics.json');
    fs.readFile(clinicsPath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ error: 'Could not load clinics.' });
        }
        res.json(JSON.parse(data));
    });
});

module.exports = router;