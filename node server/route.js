const express = require('express');
const app = express.Router();

// app.get('/', (req, res) => res.send('Isuru ranaweera'));

app.get('/',(req,res)=>{

    res.send([{hello :'test 12345',test:"123456"}]);

})
app.get('/users', (req, res) => res.send([]));
app.post('/users', (req, res) => res.send({body: req.body}));

module.exports = app;
