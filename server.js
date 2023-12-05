const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const bodyParser = require('body-parser'); 

require('dotenv').config();

const TurnierRouter = require('./turnierRoutes');

const app = express();

// Use built-in middleware for parsing JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files - adjust the path based on your project structure
app.use(express.static(path.join(__dirname, 'public')));

mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch((error) => {
        console.error('Error connecting to MongoDB:', error);
    });

const turnierRouter = new TurnierRouter();
app.use('/api', turnierRouter.getRouter()); 

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
});
