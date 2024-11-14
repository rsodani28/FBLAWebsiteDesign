const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

app.use(bodyParser.json());

// Serve static files from the current directory
app.use(express.static(__dirname));

app.post('/save-event', (req, res) => {
    const event = req.body;
    const eventData = `Title: ${event.title}, Start: ${event.start}, End: ${event.end}, AllDay: ${event.allDay}\n`;

    fs.appendFile('events.txt', eventData, (err) => {
        if (err) {
            console.error('Error writing to file', err);
            res.status(500).send('Internal Server Error');
        } else {
            res.status(200).send('Event saved successfully');
        }
    });
});

app.get('/get-events', (req, res) => {
    fs.readFile('events.txt', 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading file', err);
            res.status(500).send('Internal Server Error');
        } else {
            const events = data.trim().split('\n').map(line => {
                const [title, start, end, allDay] = line.split(', ').map(item => item.split(': ')[1]);
                return { title, start, end, allDay: allDay === 'true' };
            });
            res.json(events);
        }
    });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});