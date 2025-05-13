// server.js
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const placesRoute = require('./routes/places');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use('/api/places', placesRoute);

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});