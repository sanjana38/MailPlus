const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const multer = require('multer');
const xlsx = require('xlsx');
const fs = require('fs');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = 3000;

// ✅ Create transporter globally
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Multer setup
const upload = multer({ dest: 'uploads/' });

// Store recipients globally
let recipientsData = [];

// 📁 Upload recipients file
app.post('/upload-recipients', upload.single('recipientsFile'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: 'No file uploaded' });
    }

    const workbook = xlsx.readFile(req.file.path);
    const sheetName = workbook.SheetNames[0];
    const sheetData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

    recipientsData = sheetData;

    fs.unlinkSync(req.file.path); // Delete temp file
    res.json({ success: true, message: 'Recipients file uploaded and processed.' });
  } catch (error) {
    console.error('❌ Upload error:', error);
    res.status(500).json({ success: false, error: 'Failed to process file' });
  }
});

// 📧 Send single email
app.post('/send', async (req, res) => {
  const { to, subject, html, attachments, scheduleTime } = req.body;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject,
    html,
    attachments: (attachments || []).map(file => ({
      filename: file.filename,
      content: file.content,
      encoding: file.encoding
    }))
  };

  try {
    if (scheduleTime) {
      const delay = new Date(scheduleTime).getTime() - Date.now();
      if (delay > 0) {
        console.log('⏰ Scheduling email...');
        setTimeout(() => sendEmail(mailOptions), delay);
        return res.status(200).json({ success: true, scheduled: true });
      }
    }

    await sendEmail(mailOptions);
    res.status(200).json({ success: true });
  } catch (error) {
    console.error('❌ Error sending email:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// 📧 Send bulk emails
app.post('/send-bulk', async (req, res) => {
  try {
    const { subject, html, attachments } = req.body;

    if (!recipientsData || recipientsData.length === 0) {
      return res.status(400).json({ success: false, error: 'No recipient data. Upload a file first.' });
    }

    let count = 0;

    for (const recipient of recipientsData) {
      let personalizedHtml = html;

      for (const key in recipient) {
        const value = recipient[key];
        const regex = new RegExp(`{{${key}}}`, 'g');
        personalizedHtml = personalizedHtml.replace(regex, value);
      }

      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: recipient.email,
        subject,
        html: personalizedHtml,
        attachments
      });

      count++;
    }

    res.json({ success: true, count });
  } catch (error) {
    console.error('❌ Bulk send error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// 📩 Helper function for single email
async function sendEmail(mailOptions) {
  return transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('❌ sendMail error:', error);
    } else {
      console.log('✅ Email sent:', info.response);
    }
  });
}

// 🚀 Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
