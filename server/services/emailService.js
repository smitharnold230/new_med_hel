const nodemailer = require('nodemailer');

let transporter;

const createTransporter = async () => {
    if (process.env.EMAIL_HOST) {
        return nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: process.env.EMAIL_PORT,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });
    }

    // Generate test SMTP service account from ethereal.email
    const testAccount = await nodemailer.createTestAccount();

    console.log('✨ Ethereal Email Configured');
    console.log('User: %s', testAccount.user);
    console.log('Pass: %s', testAccount.pass);

    return nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: testAccount.user,
            pass: testAccount.pass,
        },
    });
};



/**
 * Send an email
 * @param {string} to - Recipient email
 * @param {string} subject - Email subject
 * @param {string} html - Email body (HTML)
 * @returns {Promise<Object>} - Nodemailer info object
 */
const sendEmail = async (to, subject, html) => {
    if (!transporter) {
        console.log('⏳ Waiting for email transporter to be ready...');
        transporter = await createTransporter();
    }

    try {
        const mailOptions = {
            from: '"Health Tracker" <noreply@healthtracker.ai>',
            to,
            subject,
            html
        };

        const info = await transporter.sendMail(mailOptions);

        console.log('📧 Email sent: %s', info.messageId);

        // Preview only available when sending through an Ethereal account
        if (!process.env.EMAIL_HOST) {
            console.log('🔗 Preview URL: %s', nodemailer.getTestMessageUrl(info));
        }

        return info;
    } catch (error) {
        console.error('❌ Error sending email:', error);
        throw new Error('Email delivery failed');
    }
};

module.exports = {
    sendEmail
};
