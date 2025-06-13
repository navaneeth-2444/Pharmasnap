// First install these packages:
// npm install express cors

const express = require('express');
const cors = require('cors');

const app = express();
const port = 3000;

app.use(cors());

let latestHeartRate = null;
let clients = [];

// SSE endpoint for real-time updates
app.get('/events', (req, res) => {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive'
  });

  clients.push(res);

  req.on('close', () => {
    clients = clients.filter(client => client !== res);
  });
});

// Endpoint to receive heart rate from watch
app.get('/heartrate', (req, res) => {
  const heartRate = req.query.bpm;
  const timestamp = new Date().toISOString();
  
  console.log(`Received heart rate: ${heartRate} BPM at ${timestamp}`);
  
  latestHeartRate = {
    bpm: parseFloat(heartRate),
    timestamp: timestamp
  };

  // Send to all connected clients
  clients.forEach(client => {
    client.write(`data: ${JSON.stringify(latestHeartRate)}\n\n`);
  });

  res.json({ 
    status: 'received', 
    heartRate: heartRate,
    timestamp: timestamp 
  });
});

// Get latest heart rate
app.get('/latest', (req, res) => {
  res.json(latestHeartRate || { message: 'No heart rate data yet' });
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Heart rate server listening on all interfaces at port ${port}`);
  console.log(`Your phone IP for watch configuration: Find your IP address`);
});