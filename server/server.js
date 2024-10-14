const express = require('express');
const multer = require('multer');
const sqlite3 = require('sqlite3').verbose();
const app = express();
const port = 3000;

// Set up SQLite database
const db = new sqlite3.Database('./database/items.db');

// Create table
db.run('CREATE TABLE IF NOT EXISTS items (id INTEGER PRIMARY KEY, name TEXT, description TEXT, price REAL, image TEXT)');

// Set up multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './server/uploads');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
const upload = multer({ storage: storage });

app.use(express.static('client'));
app.use('/uploads', express.static('server/uploads'));

// Handle file upload and save item to DB
app.post('/upload', upload.single('image'), (req, res) => {
    const { name, description, price } = req.body;
    const image = req.file.filename;

    db.run('INSERT INTO items (name, description, price, image) VALUES (?, ?, ?, ?)',
        [name, description, price, image], function (err) {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.status(200).json({ id: this.lastID });
        });
});

// Serve item data
app.get('/items', (req, res) => {
    db.all('SELECT * FROM items', (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(rows);
    });
});

// Mock purchase endpoint
app.get('/purchase/:id', (req, res) => {
    res.send('<h1>Purchase complete! Redirecting to payment...</h1>');
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
