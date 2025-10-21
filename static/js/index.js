var boosters;
fetch('static/data/catalog.json')
  .then(response => {
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  })
  .then(data => {
    // Render boosters
    boosters = data;
    renderBoosters(data);
  })
  .catch(error => {
    console.error('Error fetching the local file:', error);
  });

// Theme toggle functionality
const themeToggle = document.getElementById('themeToggle');
themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    themeToggle.innerHTML = document.body.classList.contains('dark-mode') 
        ? '<i class="fas fa-sun"></i>' 
        : '<i class="fas fa-moon"></i>';
});

// Render boosters
function renderBoosters(data) {
    const container = document.getElementById('boosterContainer');
    container.innerHTML = '';
    data.forEach(booster => {
        const card = document.createElement('div');
        card.className = 'booster-card';
        card.innerHTML = `
            <img src="${booster.image}" alt="${booster.name}" class="booster-image" onerror="this.src=''">
            <div class="booster-content">
                <h2 class="booster-title">${booster.name}</h2>
                <span class="booster-cost">${booster.cost}</span>
                <p class="booster-description">${booster.brief}</p>
                <div class="booster-actions">
                    <button class="btn btn-primary" onclick="window.open('${booster.link}', '_blank')">
                        <i class="fas fa-download"></i> Install
                    </button>
                    <button class="btn btn-outline" onclick="createFullScreenModal('${booster.name}', '${booster.explanation.replace(/'/g, "\\'")}')">
                        <i class="fas fa-info-circle"></i> Details
                    </button>
                </div>
            </div>
        `;
        container.appendChild(card);
    });
}

// Search functionality
const searchInput = document.getElementById('search');
searchInput.addEventListener('input', (e) => {
    const term = e.target.value.toLowerCase();
    const filtered = boosters.filter(booster => 
        booster.name.toLowerCase().includes(term) || 
        booster.brief.toLowerCase().includes(term)
    );
    renderBoosters(filtered);
});

// Details Modal
function createFullScreenModal(title, body) {
    // Create modal container
    const modal = document.createElement('div');
    modal.id = 'fullScreenModal';
    Object.assign(modal.style, {
        position: 'fixed',
        top: '0',
        left: '0',
        width: '100vw',
        height: '100vh',
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: '1000'
    });

    // Create modal content
    const modalContent = document.createElement('div');
    Object.assign(modalContent.style, {
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '8px',
        textAlign: 'center',
        width: '90vw',
        height: '90vh',
        maxWidth: '90%',
        maxHeight: '90%',
        overflowY: 'auto',
        position: 'relative'
    });

    // Add content to modal
    const heading = document.createElement('h2');
    heading.textContent = title;
    modalContent.appendChild(heading);

    const paragraph = document.createElement('p');
    paragraph.textContent = body;
    Object.assign(paragraph.style, {
        textAlign: 'start'
    });
    modalContent.appendChild(paragraph);

    // Create close button
    const closeButton = document.createElement('span');
    closeButton.textContent = '×';
    Object.assign(closeButton.style, {
        position: 'absolute',
        top: '10px',
        right: '20px',
        fontSize: '30px',
        cursor: 'pointer'
    });
    closeButton.addEventListener('click', () => {
        document.body.removeChild(modal);
    });
    modalContent.appendChild(closeButton);

    // Append content to modal container
    modal.appendChild(modalContent);

    // Append modal to body
    document.body.appendChild(modal);
}