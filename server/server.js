// Setting up modules
const path       = require('path');
const express    = require('express');

// Setting up local variables
const publicPath = path.join(__dirname, '..', 'public');

// Setting up express 
var app = express();
app.use(express.static(publicPath));

app.listen(3000, () => {
    console.log('App succesfully started');
});