import { Resend } from 'resend';

const RECAPTCHA_SECRET = process.env.reCAPTCHA_secret;

const resend = new Resend(process.env.RESEND_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Méthode non autorisée' });
  }

  const { name, email, message, recaptchaToken } = req.body;

  const verifyRes = await fetch("https://www.google.com/recaptcha/api/siteverify", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: `secret=${RECAPTCHA_SECRET}&response=${recaptchaToken}`,
  });
  const verifyData = await verifyRes.json();

  if (!verifyData.success || verifyData.score < 0.5) {
    return res.status(400).json({ error: "Échec reCAPTCHA" });
  }


  try {
    const { data, error } = await resend.emails.send({
      from: 'Contact from <onboarding@resend.dev>',
      to: ['gigialiasjuliette@gmail.com'],
      subject: `Message de ${name}`,
      html: `<p><strong>Nom :</strong> ${name}</p>
             <p><strong>Email :</strong> ${email}</p>
             <p><strong>Message :</strong> ${message}</p>`,
    });

    if (error) {
      console.error(error);
      return res.status(500).json({ error: 'Erreur lors de l’envoi de l’email.' });
    }

    res.status(200).json({ message: 'Email envoyé avec succès', data });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
}
