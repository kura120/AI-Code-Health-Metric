const biographyData = {
  name: '[Your Name]',
  age: '[Your Age]',
  profession: '[Your Profession/Student]',
  interests: '[Your Interests]',
  education: [
    { school: 'Your School Name', degree: 'Your Degree/Major', graduationDate: 'Your Graduation Date' },
    // ...
  ],
  experience: [
    { jobTitle: 'Your Job Title', company: 'Your Company Name', description: 'Your Job Description', dates: 'Your Job Dates' },
    // ...
  ],
  skills: ['Your Skill 1', 'Your Skill 2', 'Your Skill 3'],
};

// Function to get biography data
function getBiographyData() {
  // Simulate a delay in fetching data
  const delay = Math.floor(Math.random() * 3) + 1; // Random delay between 1 and 3 seconds
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(biographyData);
    }, delay * 1000);
  });
}

// Fetch and display biography data
getBiographyData().then(data => {
  updateBiography(data);
});