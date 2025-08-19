let ghosts = [];
const evidences = [
    "EMF 5",
    "Spirit Box",
    "Ghost Orbs",
    "Ghost Writing",
    "Freezing Temps",
    "DOTS Projector",
    "Ultraviolet"
];

const ASSET_BASE = 'Phasmohelper/';

async function loadGhosts() {
  try {
    const res = await fetch(`${ASSET_BASE}ghosts.json`, { cache: 'no-store' });
    if (!res.ok) throw new Error(`Failed to fetch ghosts.json: HTTP ${res.status}`);
    ghosts = await res.json();

    const evidenceButtons = document.getElementById('evidence-buttons');
    evidences.forEach(e => {
      const btn = document.createElement('button');
      btn.textContent = e;
      btn.className = "evidence-btn";
      btn.onclick = () => toggleEvidence(btn, e);
      evidenceButtons.appendChild(btn);
    });

    displayGhosts(ghosts);
  } catch (err) {
    console.error('loadGhosts error:', err);
    const ghostList = document.getElementById('ghost-list');
    if (ghostList) ghostList.innerHTML = `<p>Kunde inte ladda <code>ghosts.json</code> (${err.message}).</p>`;
  }
}

function toggleEvidence(btn, evidence) {
    const activeBtns = document.querySelectorAll('.evidence-btn.active');

    if (btn.classList.contains("active")) {
        btn.classList.remove("active");
    } else {
        if (activeBtns.length >= 3) {
        alert("You can only select up to 3 evidences!");
        return;
        }
        btn.classList.add("active");
    }

    applyFilters();
}
['minSpeed', 'maxSpeed', 'maxSanity'].forEach(id => {
    document.getElementById(id).addEventListener('input', applyFilters);
});

function applyFilters() {
    const minSpeed = parseFloat(document.getElementById('minSpeed').value);
    const maxSpeed = parseFloat(document.getElementById('maxSpeed').value);
    const maxSanity = parseFloat(document.getElementById('maxSanity').value);

    const selectedEvidences = Array.from(document.querySelectorAll('.evidence-btn.active')).map(btn => btn.textContent);

    let filtered = ghosts;

    if (selectedEvidences.length > 0) {
        filtered = filtered.filter(g =>
        selectedEvidences.every(ev => g.evidence.includes(ev))
        );
    }

    if (!isNaN(minSpeed)) filtered = filtered.filter(g => g.speed >= minSpeed);
    if (!isNaN(maxSpeed)) filtered = filtered.filter(g => g.speed <= maxSpeed);
    if (!isNaN(maxSanity)) filtered = filtered.filter(g => g.huntSanity <= maxSanity);

    displayGhosts(filtered);
    updateEvidenceButtons(filtered, selectedEvidences);
}

function displayGhosts(list) {
    const ghostList = document.getElementById('ghost-list');
    const oldCards = ghostList.querySelectorAll('.ghost-card');
    oldCards.forEach(card => card.classList.add('fade-out'));

    setTimeout(() => {
        ghostList.innerHTML = "";

        if (list.length === 0) {
        ghostList.innerHTML = "<p>No ghosts match your filters.</p>";
        return;
        }

        list.forEach(g => {
        const card = document.createElement('div');
        card.className = 'ghost-card fade-in';
        card.innerHTML = `
            <h2>${g.name}</h2>
            <p><b>Evidence:</b> ${g.evidence.join(', ')}</p>
            <p><b>Speed:</b> ${g.speed} m/s</p>
            <p><b>Category:</b> ${g.speedCategory}</p>
            <p><b>Hunt Sanity:</b> ${g.huntSanity}%</p>
            <p><b>Behavior:</b> ${g.behavior}</p>
        `;
        ghostList.appendChild(card);
        setTimeout(() => card.classList.remove('fade-in'), 400);
        });
    }, 400);
}

function updateEvidenceButtons(filteredGhosts, selectedEvidences) {
    const buttons = document.querySelectorAll('.evidence-btn');

    buttons.forEach(btn => {
        const evidence = btn.textContent;

        if (selectedEvidences.includes(evidence)) {
        btn.disabled = false;
        btn.classList.remove('disabled');
        return;
        }

        const possible = filteredGhosts.some(g => g.evidence.includes(evidence));

        if (!possible) {
        btn.disabled = true;
        btn.classList.add('disabled');
        } else {
        btn.disabled = false;
        btn.classList.remove('disabled');
        }
    });
}
loadGhosts();