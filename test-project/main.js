// Import required modules
const express = require('express');
const app = express();
const port = 3000;

// Biography data
const biography = {
  name: "John Doe",
  age: 30,
  profession: "Software Developer",
  bio: "Passionate about coding and building meaningful software. Loves traveling and exploring new technologies.",
};

// Serve front-end
app.get('/', (req, res) => {
  const frontEndLogic = `
    (() => {
      const appDiv = document.createElement('div');
      appDiv.style.fontFamily = 'Arial, sans-serif';
      appDiv.style.margin = '20px';

      const title = document.createElement('h1');
      title.innerText = 'Biography';

      const name = document.createElement('p');
      name.innerText = 'Name: ${biography.name}';

      const age = document.createElement('p');
      age.innerText = 'Age: ${biography.age}';

      const profession = document.createElement('p');
      profession.innerText = 'Profession: ${biography.profession}';

      const bio = document.createElement('p');
      bio.innerText = 'Bio: ${biography.bio}';

      appDiv.appendChild(title);
      appDiv.appendChild(name);
      appDiv.appendChild(age);
      appDiv.appendChild(profession);
      appDiv.appendChild(bio);

      document.body.appendChild(appDiv);
    })();
  `;

  res.send(`<!DOCTYPE html>
    <html>
    <head>
      <title>Biography</title>
      <script>${frontEndLogic}</script>
    </head>
    <body></body>
    </html>`);
});

// Start the server
app.listen(port, () => {
  console.log(`Biography app listening at http://localhost:${port}`);
});
