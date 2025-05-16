// Fetch and display clinics
function renderClinics(clinics) {
    const list = document.getElementById('clinic-list');
    if (clinics.length === 0) {
        list.innerHTML = "<p>No clinics found.</p>";
        return;
    }
    list.innerHTML = clinics.map(clinic => `
      <div class="clinic-card">
        <img src="${clinic.image}" alt="${clinic.name}" style="max-width:120px;float:right;margin-left:20px;">
        <h2>${clinic.name}</h2>
        <p><strong>Type:</strong> ${clinic.type}</p>
        <p><strong>Address:</strong> ${clinic.address}</p>
        <p><strong>Phone:</strong> ${clinic.phone}</p>
        <p>${clinic.description}</p>
        <a href="${clinic.website}" target="_blank">Visit Website</a>
      </div>
    `).join('');
}

let allClinics = [];

fetch('/api/clinics')
  .then(res => res.json())
  .then(clinics => {
    allClinics = clinics;
    renderClinics(clinics);
  });

document.getElementById('search').addEventListener('input', function() {
    const query = this.value.toLowerCase();
    const filtered = allClinics.filter(clinic =>
        clinic.name.toLowerCase().includes(query) ||
        clinic.type.toLowerCase().includes(query) ||
        clinic.address.toLowerCase().includes(query)
    );
    renderClinics(filtered);
});