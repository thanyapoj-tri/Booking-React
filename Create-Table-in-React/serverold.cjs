const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const cors = require('cors');  // Add this line

const app = express();
const port = 3001;

app.use(cors());  // Add this line
app.use(bodyParser.json());

app.post('/send-line-notification', (req, res) => {
    const { message } = req.body;
    const token = '8slGeeb0faUlVbqsxnC18Cf4Seki4rmFNtnosHIbv0F'; // my token
    // const token = '0Gd7z2YrmgzHNFRY6fwcuVxM566fD4eFL5zfmWugqYa'; // Ptui token

    const headers = {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Bearer ${token}`
    };

    axios.post('https://notify-api.line.me/api/notify', `message=${message}`, { headers })
        .then(response => {
            res.status(200).json({ success: true, data: response.data });
        })
        .catch(error => {
            res.status(500).json({ success: false, error: error.message });
        });
});

app.listen(port, () => {
    console.log(`Line Server running at http://localhost:${port}`);
});
