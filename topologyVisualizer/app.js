const express = require('express');
const app = express();
const bodyParser = require("body-parser");
//const {spawn} = require('child_process');
//const {exec} = require('child_process');

// URL site: http://192.168.56.2:8080
const PORT = 8080;

app.use(express.static(__dirname + '/html'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


app.listen(PORT, function() {
    console.log('Server is listening on Port: ', PORT);
});