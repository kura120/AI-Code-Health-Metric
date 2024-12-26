// client.js
document.addEventListener('DOMContentLoaded', () => {
    // Apply base styles to body
    Object.assign(document.body.style, {
        margin: '0',
        padding: '0',
        fontFamily: 'Arial, sans-serif',
        lineHeight: '1.6',
        color: '#333'
    });

    // Create and style header
    const header = document.createElement('header');
    Object.assign(header.style, {
        background: '#333',
        color: 'white',
        padding: '1rem 0',
        position: 'fixed',
        width: '100%',
        top: '0',
        zIndex: '100'
    });

    // Create navigation
    const nav = document.createElement('nav');
    const navItems = ['About', 'Experience', 'Skills'];
    const ul = document.createElement('ul');
    Object.assign(ul.style, {
        display: 'flex',
        justifyContent: 'center',
        listStyle: 'none',
        margin: '0',
        padding: '0'
    });

    navItems.forEach(item => {
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.textContent = item;
        a.href = `#${item.toLowerCase()}`;
        Object.assign(a.style, {
            color: 'white',
            textDecoration: 'none',
            padding: '0 15px'
        });
        li.appendChild(a);
        ul.appendChild(li);
    });

    nav.appendChild(ul);
    header.appendChild(nav);
    document.body.appendChild(header);

    // Create main container
    const main = document.createElement('main');
    Object.assign(main.style, {
        maxWidth: '1200px',
        margin: '80px auto 0',
        padding: '20px'
    });

    // Function to create sections
    function createSection(id, title) {
        const section = document.createElement('section');
        section.id = id;
        Object.assign(section.style, {
            marginBottom: '40px',
            padding: '20px',
            background: '#f4f4f4',
            borderRadius: '5px'
        });

        const h2 = document.createElement('h2');
        h2.textContent = title;
        Object.assign(h2.style, {
            marginBottom: '20px',
            color: '#333'
        });

        section.appendChild(h2);
        return section;
    }

    // Fetch and display bio data
    fetch('/api/bio')
        .then(response => response.json())
        .then(data => {
            // Hero section
            const hero = document.createElement('section');
            Object.assign(hero.style, {
                textAlign: 'center',
                marginBottom: '40px'
            });

            const name = document.createElement('h1');
            name.textContent = data.name;
            Object.assign(name.style, {
                fontSize: '2.5rem',
                marginBottom: '10px'
            });

            const title = document.createElement('h2');
            title.textContent = data.title;
            Object.assign(title.style, {
                fontSize: '1.5rem',
                color: '#666'
            });

            hero.appendChild(name);
            hero.appendChild(title);
            main.appendChild(hero);

            // About section
            const aboutSection = createSection('about', 'About Me');
            const aboutText = document.createElement('p');
            aboutText.textContent = data.about;
            aboutSection.appendChild(aboutText);
            main.appendChild(aboutSection);

            // Experience section
            const expSection = createSection('experience', 'Experience');
            data.experience.forEach(exp => {
                const expItem = document.createElement('div');
                Object.assign(expItem.style, {
                    marginBottom: '20px',
                    padding: '15px',
                    background: 'white',
                    borderRadius: '5px'
                });

                const expTitle = document.createElement('h3');
                expTitle.textContent = exp.title;
                const company = document.createElement('p');
                company.textContent = exp.company;
                const years = document.createElement('p');
                years.textContent = exp.years;

                [expTitle, company, years].forEach(el => expItem.appendChild(el));
                expSection.appendChild(expItem);
            });
            main.appendChild(expSection);

            // Skills section
            const skillsSection = createSection('skills', 'Skills');
            const skillsGrid = document.createElement('div');
            Object.assign(skillsGrid.style, {
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
                gap: '20px'
            });

            data.skills.forEach(skill => {
                const skillItem = document.createElement('div');
                skillItem.textContent = skill;
                Object.assign(skillItem.style, {
                    padding: '15px',
                    background: 'white',
                    borderRadius: '5px',
                    textAlign: 'center'
                });
                skillsGrid.appendChild(skillItem);
            });
            skillsSection.appendChild(skillsGrid);
            main.appendChild(skillsSection);
        })
        .catch(error => console.error('Error:', error));

    document.body.appendChild(main);

    // Create footer
    const footer = document.createElement('footer');
    Object.assign(footer.style, {
        background: '#333',
        color: 'white',
        textAlign: 'center',
        padding: '20px',
        position: 'fixed',
        bottom: '0',
        width: '100%'
    });
    footer.textContent = `© ${new Date().getFullYear()} Biography Website`;
    document.body.appendChild(footer);
});