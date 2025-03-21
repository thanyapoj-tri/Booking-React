const express = require('express');
const app = express();

app.use(express.json());

app.post('/webhook', (req, res) => {
    const events = req.body.events;
  
    events.forEach(event => {
      if (event.source.type === 'group') {
        console.log('Group ID:', event.source.groupId);
      } else if (event.source.type === 'room') {
        console.log('Room ID:', event.source.roomId);
      } else if (event.source.type === 'user') {
        console.log('User ID:', event.source.userId);
      }
    });
  
    res.sendStatus(200); // Respond OK to LINE
  });

// Start the server
const PORT = 3020;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
