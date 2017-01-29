// Setting up modules
const path       = require('path');
const express    = require('express');

// Setting up local variables
const publicPath = path.join(__dirname, '..', 'public');
const PORT = process.env.PORT || 3000;

// Setting up express 
var app = express();
app.use(express.static(publicPath));

app.listen(PORT, () => {
    console.log(`App succesfully started on ${PORT}`);
});