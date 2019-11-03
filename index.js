const express = require('express');
const multer = require('multer');
const uuidv4 = require('uuid/v4');
const sharp = require('sharp');
const fs = require('fs')
var path = require('path');

const app = express();
const PORT = 80;

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, __dirname + '/public/uploads')
    },
    filename: function (req, file, cb) {
        cb(null, `${uuidv4()}${path.extname(file.originalname)}`)
    }
})

const upload = multer({ storage: storage })

app.use(express.static('public'));

app.get('/', (req, res) => {
    res.send('Wellcome to image server!');
});

app.post('/upload', upload.single('file'), (req, res) => {
    if (req.file) {
        res.json(req.file);
    }
    else throw 'error';
});

app.get('/resized/:size/:name', (req, res) => {
    try {
        let size = req.params.size;
        let name = req.params.name;
        let width = 0;
        let height = 0;

        let fieldsSize = size.split('-');
        if (fieldsSize && fieldsSize.length === 3) {
            width = parseInt(fieldsSize[1]);
            height = parseInt(fieldsSize[2]);
        }

        resize(`public/uploads/${name}`, width, height, res);
    } catch (error) {
        res.status(500).json({ error }).end();
    }
});

function resize(path, width, height, res) {
    const readStream = fs.createReadStream(path);
    readStream.on("error", function (error) {
        res.status(404).json({ error }).end();
    });

    let transform = sharp();

    if (width || height) {
        transform = transform.resize(width, height)
    }

    readStream.pipe(transform).pipe(res)
}

app.listen(PORT, () => {
    console.log(`Listening at: http://localhost:${PORT}/`);
});