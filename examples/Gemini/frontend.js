const bioContainer = document.createElement('div');
bioContainer.style.fontFamily = 'sans-serif';
bioContainer.style.margin = '20px';

const title = document.createElement('h1');
title.textContent = 'My Biography';
bioContainer.appendChild(title);

const about = document.createElement('p');
bioContainer.appendChild(about);

// ... (add more elements for education, experience, skills, etc.)

document.body.appendChild(bioContainer);

function updateBiography(data) {
  // Use an if statement to conditionally display information
  if (data.age >= 18) {
    about.textContent = `My name is ${data.name} and I am ${data.age} years old. I am a ${data.profession} who is passionate about ${data.interests}.`;
  } else {
    about.textContent = `My name is ${data.name}. I am a ${data.profession} who is passionate about ${data.interests}.`;
  }

  // ... (update other elements with data)
}