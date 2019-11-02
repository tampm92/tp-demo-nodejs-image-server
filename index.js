const express = require('express');
const multer = require('multer');
const upload = multer({dest: __dirname + '/public/images'});

const app = express();
const PORT = 3000;

app.use(express.static('public'));

app.get('/', (req, res) => {
    res.send('Wellcome to image server!');
});

app.post('/upload', upload.single('file'), (req, res) => {
    if(req.file) {
        res.json(req.file);
    }
    else throw 'error';
});

app.listen(PORT, () => {
    console.log(`Listening at: http://localhost:${PORT}/` );
});