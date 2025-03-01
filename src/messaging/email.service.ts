const fs = require('fs').promises;
const path = require('path');
const {google} = require('googleapis');

const TOKEN_PATH = path.join(process.cwd(), '../', 'gmail.token.json');

async function loadCredentials() {
  try {
    const content = await fs.readFile(TOKEN_PATH);
    const credentials = JSON.parse(content);
    return google.auth.fromJSON(credentials);
  } catch (err) {
    return null;
  }
}

async function sendEmail({to, subject, text}: {to: string; subject: string; text: string}) {
  const auth = await loadCredentials();
  const gmail = google.gmail({version: 'v1', auth});
  const emailLines = [
    'From: messanger.kutoa@gmail.com',
    `To: ${to}`,
    'Content-type: text/html;charset=iso-8859-1',
    'MIME-Version: 1.0',
    `Subject: ${subject}`,
    '',
    `${text}`,
  ];

  const email = emailLines.join('\r\n').trim();
  const base64Email = Buffer.from(email).toString('base64');
  await gmail.users.messages.send({
    userId: 'messanger.kutoa@gmail.com',
    requestBody: {
      raw: base64Email,
    },
  });
}

export const emailService = {sendEmail};
