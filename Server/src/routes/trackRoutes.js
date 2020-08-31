const mongoose = require('mongoose');
const { Router } = require('express');
const requireAuth = require('../middlewares/requireAuth.js');

const Track = mongoose.model('Track');
const router = Router();

router.use(requireAuth);

router.get('/tracks', async (req, res) => {
    const tracks = await Track.find({ userId: req.user.id })

    res.send(tracks);
})

router.post('/tracks', async (req, res) => {
    const { name, locations } = req.body;

    if (!name || !locations) {
        return res.status(422).send({ error: 'You must provide a name and locations' })
    }

    try {
        const track = new Track({ name: name, locations, userId: req.user.id })
        await track.save();
        res.send(track);
    } catch (e) {
        res.status(422).send({ error: e.message });
    }
})

module.exports = router;