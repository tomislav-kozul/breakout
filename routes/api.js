require('dotenv').config();
const axios = require('axios');
const crypto = require('crypto');
const express = require('express');
const router = express.Router();
const dbClient = require('../pgdatabase'); 

router.use(express.json());

function calculateHash(input) {
    return crypto.createHash('sha256').update(input).digest('hex');
}

/*router.get('/hashes', async (req, res) => {
    const passwords = [
        '123456',
        'qwert123',
        'password123',
        'letmein',
        '1234!',
        '123456',
        'hello123',
        '123456',
        'pass123',
        'abc123'
    ];
    passwords.forEach(item => {
        const hash = calculateHash(item);
        console.log(`${item} -> ${hash}`);
    });
    res.status(200).json({ message: 'Hashes calculated and logged successfully.' });
});*/


router.post('/login', async (req, res) => {
    if (!req.body) {
        return res.status(400).json({ error: 'Invalid request!' });
    }

    const { username, password, injection } = req.body;

    if (!username || !password ) {
        return res.status(400).json({ error: 'All fields are required!' });
    }

    const password_hash = calculateHash(password);

    try {
        var rows;
        if(!injection) {
            // zaštita od SQL injectiona - parametrizirani query
            const fetchDataQuery = 'SELECT * FROM users INNER JOIN cards ON  users.username = cards.username WHERE users.username = ($1) AND users.password = ($2)';
            const fetchDataResponse = await dbClient.query(fetchDataQuery, [username, password_hash]);
            rows = fetchDataResponse.rows;
        } else {
            const fetchDataQuery = `SELECT * FROM users INNER JOIN cards ON users.username = cards.username WHERE users.username = '${username}' AND users.password = '${password_hash}'`;
            const fetchDataResponse = await dbClient.query(fetchDataQuery);
            rows = fetchDataResponse.rows;
        }

        if (rows.length > 0) {
            return res.status(200).json({ message: 'Login successful.', data: rows });
        } else {
            return res.status(404).json({ message: 'Incorrect login data. Try again' });
        }
    } catch (err) {
        return res.status(500).json({ message: 'An error has occurred while fetching data.' });
    }
    
});


router.post('/login-challenge', async (req, res) => {
    if (!req.body) {
        return res.status(400).json({ error: 'Invalid request!' });
    }

    const { username, password, injection, captcha_response } = req.body;

    if (!username || !password || !captcha_response ) {
        return res.status(400).json({ error: 'All fields are required!' });
    }

    /// tu cemo provjerit captchu
    const verificationResponse = await axios.post(
        `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.CAPTCHA_SECRET_KEY}&response=${captcha_response}`
    );
    const isValidCaptcha = verificationResponse.data.success;

    if(!isValidCaptcha) {
        return res.status(400).json({ message: "'CAPTCHA' not verified successfully" });
    }


    const password_hash = calculateHash(password);

    try {
        var rows;
        if(!injection) {
            // zaštita od SQL injectiona - parametrizirani query
            const fetchDataQuery = 'SELECT * FROM users INNER JOIN cards ON  users.username = cards.username WHERE users.username = ($1) AND users.password = ($2)';
            const fetchDataResponse = await dbClient.query(fetchDataQuery, [username, password_hash]);
            rows = fetchDataResponse.rows;
        } else {
            const fetchDataQuery = `SELECT * FROM users INNER JOIN cards ON users.username = cards.username WHERE users.username = '${username}' AND users.password = '${password_hash}'`;
            const fetchDataResponse = await dbClient.query(fetchDataQuery);
            rows = fetchDataResponse.rows;
        }

        if (rows.length > 0) {
            return res.status(200).json({ message: 'Login successful.', data: rows });
        } else {
            return res.status(404).json({ message: 'Incorrect login data. Try again' });
        }
    } catch (err) {
        return res.status(500).json({ message: 'An error has occurred while fetching data.' });
    }
    
});

module.exports = router;