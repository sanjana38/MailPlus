# 📧 MailPlus: Automate and Personalize 

MailPlus is a Node.js application that lets you:

- 📁 Upload recipient lists via `.xlsx` files  
- 📝 Personalize email content using template placeholders  
- 📤 Send bulk emails using your Gmail account (via App Password)  
- 🔍 See a live HTML preview and receive a success alert after sending  

🔧 Setup Instructions
1. Clone the Repository
git clone https://github.com/sanjana38/MailPlus.git

   cd MailPlus. 

3. Install Dependencies
   
   npm install 

5. Configure Environment Variables
   
    Create a .env file based on the provided .env.example.

     cp .env.example .env

    Edit .env and add your Gmail credentials:

     .env file

EMAIL_USER=your_email@gmail.com

EMAIL_PASS=your_app_password(16 digit)

⚠️ Use an App Password, not your real Gmail password!

4. Generate Gmail App Password
   
   Go to Google Account – Security

   Enable 2-Step Verification

   Go to App Passwords

   Select Mail as the app and generate a password

  Copy the 16-character code  and paste it into .env as EMAIL_PASS


6. install npm if already not done, then go to backend folder or type

   cd backend

   Now, run server.js file by typing

    node server.js

     you will be seeing a message in cmd prompt saying server running if everything is fine.

8. Uploading Recipients
   
10. Create an excel file ( .xlns) with headers like name,email such as:
    

   | email               | name  |
  |---------------------|-------|
  | user1@example.com   | Alice |
  | user2@example.com   | Bob   |
  | user3@example.com   | Carol |


Save this file and then on left side in upload recipients choose this .xlns file and click on upload .

The backend will read and store the recipient data in memory

7. ✉️ Sending Bulk Emails
   
   After uploading, enter your email subject and an HTML body with placeholders in left side panel.

   And then

    Click Send Bulk to send to multiple recipients.
 
    If you want to change content or edit anything, you can do thta from left side section.And see the live preview on the right side.

   After 3 to 5 seconds you should be able to see alert message which says mail has been sent. Hence, mail has been sent to all the recipients with their name from excel sheet.

8. 💡 Features
   
   -XLSX parsing via xlsx 

    -File upload via multer

    -Email sending via nodemailer

    -Secure credentials via .env

    -Supports attachments

     -Schedule Mails



