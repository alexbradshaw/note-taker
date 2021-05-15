const express = require('express');
const path = require('path');
const fs = require('fs');
const uuid = require('uuid');

const app = express();
var PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

fs.readFile('public/assets/db.json', function read(err, data) {
    if(err){
        fs.writeFile('public/assets/db.json', '', err => {
            if (err) {
                throw err;
            }
        })  
    }

})

app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'public/index.html')));
app.get('/notes', (req, res) => res.sendFile(path.join(__dirname, 'public/notes.html')));
app.get('/api/notes/', (req, res) => res.sendFile(path.join(__dirname, 'public/assets/db.json')));

app.delete(`/api/notes/:id`, (req, res) => {
    const currentId = req.params.id
    fs.readFile('public/assets/db.json', function read(err, data) {
        if (err) {
            throw err;
        }
        const notes = JSON.parse(data)
        const filteredNotes = notes.filter(function(note){
        return note.id !== currentId
        })
        fs.writeFile('public/assets/db.json', JSON.stringify(filteredNotes), err => {
            if (err) {
                throw err;
            }
            res.json({});
        })
    })
})

app.post('/api/notes/', (req, res) => {
    fs.readFile('public/assets/db.json', function read(err, data) {
        if (err) {
            throw err;
        }
        let returnedObject = `[{"title":"${req.body.title}", "text":"${req.body.text}", "id": "${uuid.v4()}"}`

        if (!(data.toString()).includes('{')) {
            returnedObject += ']'
        } else {
            returnedObject += (data.toString()).replace('[', ',');
        }
        fs.writeFile('public/assets/db.json', returnedObject, err => {
            if (err) {
                throw err;
            }
            res.json({});
        })
    });

});



app.listen(PORT, () => console.log(`App listening on PORT ${PORT}`));