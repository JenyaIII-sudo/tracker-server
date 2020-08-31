const mongoose = require('mongoose');
const User = mongoose.model('User');
const { Router } = require('express');
const { check, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const config = require('config');
const bcrypt = require('bcrypt');

const router = Router();

router.post('/signup', [
    check('email', 'Email incorrect!').isEmail(),
    check('password', 'Password incorrect, min 6 symbols').isLength({ min: 6 }),
], async (req, res) => {
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array(),
                message: 'Incorrect data when you try Register',
            });
        }
        const { email, password } = req.body;

        const candidate = await User.findOne({ email });
        if (candidate) {
            res.status(400).json({ message: 'This user already exists' });
        }
        const hashedPassword = await bcrypt.hash(password, 12);
        const user = new User({ email, password: hashedPassword });
        await user.save();

        const token = jwt.sign({ userId: user.id }, config.get('jwtSecretCode'));
        res.status(201).json({ message: 'User has been created ! ', token });
    } catch (e) {
        res.status(500).json({ message: 'Daaamn, Something wrong... Try again' });
    }
});

router.post('/login', [
    check('email', 'Enter the correct email !').isEmail(),
    check('password', 'Enter the correct password !').exists(),
], async (req, res) => {
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array(),
                message: 'Incorrect data when you try Login',
            })
        }
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            res.status(400).json({ message: 'User not found, Pls TRY AGAIN !' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Password incorrect !' });
        }

        const token = jwt.sign(
            { userId: user.id },
            config.get('jwtSecretCode'),
            { expiresIn: '1h' },
            );

        res.json({ token, userId: user.id });
    } catch (e) {
        res.status(500).json({ message: 'Daaamn, Something wrong... Try again' });
    }
});

module.exports = router;