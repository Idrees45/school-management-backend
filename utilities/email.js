require('dotenv').config();
const nodemailer = require('nodemailer');

const emailsend= (email,randompassword)=>{
    console.log('Email Password:', process.env.EMAIL_PASSWORD);

    const transporter = nodemailer.createTransport({

        host: 'sandbox.smtp.mailtrap.io',  // Mailtrap SMTP server
        port: 2525,                         // SMTP port
        auth: {
          user:process.env.USER,           // Mailtrap username
          pass:process.env.PASS,              // Mailtrap password
        },
    //   service: 'gmail',
    
    //   port: 465,
    // secure: true,
    //   auth: {
    //       user: 'midreesbaloch79@gmail.com',
    //       pass:process.env.EMAIL_PASSWORD
    //   }
    });
    // Define email options
    const mailOptions = {
        from: 'midreesbaloch79@gmail.com',
        to: email,  // This should be the dynamic recipient email
        subject: 'Your Password',
        text: `Your password is: ${randompassword}`,  // The body of the email
     };
    
    // Send the email
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log('Error sending email:', error);
      } else {
        console.log('Email sent:', info.response);
      }
    });
    
  }

 module.exports=emailsend