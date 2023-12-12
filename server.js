const express = require('express');
const multer = require('multer');
const path = require('path');

const app = express();
const port = 3000;

// Set up multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});

const upload = multer({ storage: storage });

// Serve HTML and CSS
app.use(express.static(path.join(__dirname, 'public')));

// Define a route for the root path
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Handle file uploads
app.post('/upload', upload.single('file'), (req, res) => {
    if (req.file) {
        res.json({ filename: req.file.originalname });
    } else {
        res.status(400).json({ error: 'No file uploaded' });
    }
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});

app.get('/uploads/:filename', (req, res) => {
    const filename = req.params.filename;
    const filePath = path.join(__dirname, 'uploads', filename);

    // Use the res.download method to initiate a file download
    res.download(filePath, filename, (err) => {
        if (err) {
            // Handle errors, for example, file not found
            res.status(404).json({ error: 'File not found' });
        }
    });
});
