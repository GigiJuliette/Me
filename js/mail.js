const form = document.getElementById('contact-form');
const status = document.getElementById('status');

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const formData = new FormData(form);
  const data = Object.fromEntries(formData.entries());

  try {
    const response = await fetch('/api/contact.js', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      status.textContent = '✅ Message envoyé avec succès !';
      form.reset();
    } else {
      status.textContent = '❌ Une erreur est survenue.';
    }
  } catch (err) {
    console.error(err);
    status.textContent = '❌ Échec lors de l’envoi.';
  }
});