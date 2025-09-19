import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Méthode non autorisée' });
  }

  const { name, email, message } = req.body;

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
