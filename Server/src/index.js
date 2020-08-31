const mongoose = require('mongoose');
const express = require('express');
require('./models/User.js');
require('./models/Track.js');
const authRoutes = require('./routes/authRoutes.js');
const trackRoutes = require('./routes/trackRoutes.js');
const bodyParser = require('body-parser');
const config = require('config');
const cors = require('cors');

const app = express();

app.use(bodyParser.json())
app.use(authRoutes);
app.use(trackRoutes);
app.use(cors());

const mongoURI = config.get('mongoURI');
const PORT = process.env.PORT || 3000;

mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
});
mongoose.connection.on('connected', () => {
    console.log('Connected to mongo instance');
});
mongoose.connection.on('error', (rr) => {
    console.error('Error connection to mongo', err);
});

app.get('/', (req, res) => {
    res.send('Hi there');
});

app.listen(PORT, () => {
    console.log('Listening on port 3000')
});