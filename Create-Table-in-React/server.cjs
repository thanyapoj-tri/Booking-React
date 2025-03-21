const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = 3050;

// Middleware
app.use(cors());
app.use(express.json());

// LINE Messaging API Configuration
const LINE_CHANNEL_ACCESS_TOKEN = 'aVvjXdXH5ftlwN8hGeBIxw6NH4qu1IvKEWKqBWbgMLnStJ2ip9MAdppgsH1hbJXUGxRP7X8RhqngWYHYEAR2k4Zx0UALv09hWWo+nw/Vd1RALqqIS5Vpy/lW7NEfDxji+H9f5zsJnZa/c7aEALKxJQdB04t89/1O/w1cDnyilFU=';

// Endpoint to send LINE messages
app.post('/send-line-message', async (req, res) => {
  const { userId, message } = req.body;

  try {
    const response = await axios.post(
      'https://api.line.me/v2/bot/message/push',
      {
        to: userId,
        messages: [{ type: 'text', text: message }],
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${LINE_CHANNEL_ACCESS_TOKEN}`,
        },
      }
    );

    res.status(200).json({ success: true, response: response.data });
  } catch (error) {
    console.error('Error sending LINE message:', error.response?.data || error.message);
    res.status(500).json({ success: false, error: error.response?.data || error.message });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
