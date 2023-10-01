const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const twilio = require('twilio');
const randomstring = require('randomstring');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3001;

app.use(bodyParser.json());
app.use(cors());

// Email verification

const emailTransporter = nodemailer.createTransport({
    service: 'Gmail', 
    auth: {
      user: 'sufiyannissam@gmail.com', // Sender email address
      pass: 'wrmyawxdobbndfdk',    // Sender email password
    },
  });

const emailOtpMap = new Map();

app.post('/sendEmailOTP', async (req, res) => {
  const { email } = req.body;

  const otp = randomstring.generate({
    length: 6,
    charset: 'numeric',
  });
  console.log(`${otp}`);

  emailOtpMap.set(email, otp);

  const mailOptions = {
    from: '', // Sender email address
    to: email,
    subject: 'Your OTP for Login',
    text: `Your OTP is: ${otp}`,
  };

  try {
    await emailTransporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Email OTP sent successfully' });
  } catch (error) {
    console.error('Error sending email OTP:', error);
    res.status(500).json({ error: 'An error occurred while sending email OTP' });
  }
});

app.post('/verifyEmailOTP', (req, res) => {
    const { email, emailOTP } = req.body; // Update to use emailOTP
  
    if (emailOtpMap.has(email) && emailOtpMap.get(email) === emailOTP) { // Update to use emailOTP
      emailOtpMap.delete(email);
      res.status(200).json({ verified: true });
    } else {
      res.status(200).json({ verified: false });
    }
  });
  
  

// Phone verification

const twilioClient = twilio('ACac1373d4398f7eb47424ce181126c7be', 'd90ab12965ceb68ad54f9015d3e2cdd9');
//eda twilio browseril edkk
const phoneOtpMap = new Map();

app.post('/sendPhoneOTP', async (req, res) => {
  const { phoneNumber } = req.body;

  const otp = randomstring.generate({
    length: 6,
    charset: 'numeric',
  });

  phoneOtpMap.set(phoneNumber, otp);

  try {
    await twilioClient.messages.create({
        body: `Your OTP is: ${otp}`,
        from: '+12056145506',
        to: phoneNumber,
      });

    res.status(200).json({ message: 'Phone OTP sent successfully' });
  } catch (error) {
    console.error('Error sending phone OTP:', error);
    res.status(500).json({ error: 'An error occurred while sending phone OTP' });
  }
});

app.post('/verifyPhoneOTP', (req, res) => {
    const { phoneNumber, phoneOTP } = req.body; 
  
    if (phoneOtpMap.has(phoneNumber) && phoneOtpMap.get(phoneNumber) === phoneOTP) { 
      phoneOtpMap.delete(phoneNumber);
      res.status(200).json({ verified: true });
    } else {
      res.status(200).json({ verified: false });
    }
  });
  

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});