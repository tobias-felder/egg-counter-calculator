document.getElementById('signup-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const email = document.getElementById('email').value;
    // For now, just show a thank you message (replace with real backend/email service later)
    document.getElementById('signup-message').textContent =
        "Thank you! Your free ebook will be sent to " + email + " when we launch.";
    document.getElementById('signup-form').reset();
});