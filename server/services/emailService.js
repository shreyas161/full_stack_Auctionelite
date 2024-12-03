const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

const sendAuctionNotification = async (userEmail, auctionDetails) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: userEmail,
    subject: `Auction Starting Soon: ${auctionDetails.title}`,
    html: `
      <h2>Your Auction is Starting Soon!</h2>
      <p>The auction for "${auctionDetails.title}" will begin in 1 hour.</p>
      <p>Starting Price: $${auctionDetails.startingPrice}</p>
      <p>Date: ${new Date(auctionDetails.auctionDate).toLocaleString()}</p>
      <a href="http://localhost:3000/item/${auctionDetails.id}">Click here to join the auction</a>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Notification email sent successfully');
  } catch (error) {
    console.error('Error sending notification email:', error);
  }
};

module.exports = { sendAuctionNotification }; 