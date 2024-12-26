// server.js
const express = require('express');
const app = express();
const port = 3000;

// Sample bio data
const bioData = {
    name: "Jane Doe",
    title: "Software Developer",
    about: "Passionate developer with 5+ years of experience in web technologies.",
    experience: [
        {
            title: "Senior Developer",
            company: "Tech Corp",
            years: "2020-Present"
        },
        {
            title: "Web Developer",
            company: "Digital Solutions",
            years: "2018-2020"
        }
    ],
    skills: ["JavaScript", "Node.js", "React", "Express", "MongoDB"]
};

// API endpoint
app.get('/api/bio', (req, res) => {
    res.json(bioData);
});

// Serve the client-side JavaScript
app.get('/', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html>
            <head>
                <title>Biography</title>
            </head>
            <body>
                <script src="/client.js"></script>
            </body>
        </html>
    `);
});

app.get('/client.js', (req, res) => {
    res.sendFile(__dirname + '/client.js');
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});