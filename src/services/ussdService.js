const User = require('../models/user');
const twilio = require('twilio');
const dotenv = require('dotenv');

dotenv.config();

const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

exports.handleUssdRequest = async (req, res) => {
  const { sessionId, serviceCode, phoneNumber, text } = req.body;

  let response = '';

  if (text === '') {
    response = 'CON Choose your language\n1. English\n2. Kinyarwanda\n3. French';
  } else {
    const parts = text.split('*');
    if (parts.length === 1) {
      const choice = parts[0];
      if (choice === '1') {
        response = 'CON Enter your first name:';
      } else if (choice === '2') {
        response = 'CON Injiza izina ryawe rya mbere:';
      } else if (choice === '3') {
        response = 'CON Entrez votre prénom:';
      } else {
        response = 'END Invalid choice';
      }
    } else if (parts.length === 2) {
      const firstName = parts[1];
      response = `CON Enter your last name:`;
    } else if (parts.length === 3) {
      const firstName = parts[1];
      const lastName = parts[2];
      response = 'CON Enter your level of study (e.g., Y1 IT, Y2 IT, Y3 IT):';
    } else if (parts.length === 4) {
      const firstName = parts[1];
      const lastName = parts[2];
      const levelOfStudy = parts[3];

      try {
        const existingUser = await User.findByPhoneNumber(phoneNumber);
        if (existingUser) {
          response = 'END You are already registered.';
        } else {
          await User.register(firstName, lastName, levelOfStudy);
          client.messages.create({
            body: 'Registration successful',
            from: process.env.TWILIO_PHONE_NUMBER,
            to: phoneNumber
          });
          response = 'END Registration successful';
        }
      } catch (error) {
        response = 'END Error registering user';
      }
    } else {
      response = 'END Invalid choice';
    }
  }

  res.send(response);
};
