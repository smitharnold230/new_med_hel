const cron = require('node-cron');
const { User, HealthLog, Doctor, Medicine } = require('../models');
const { Op } = require('sequelize');
const { sendEmail } = require('./emailService');

const initCronJobs = () => {
    console.log('⏰ Initializing Cron Jobs...');

    // Job 1: Daily Log Reminder (Runs every hour to check user preferences)
    cron.schedule('0 * * * *', async () => {
        console.log('Running Daily Log Reminder Check...');
        try {
            const now = new Date();
            const currentHour = now.getHours();

            // Find users who want reminders at this hour
            const users = await User.findAll({
                where: {
                    reminderTime: currentHour
                }
            });

            console.log(`Found ${users.length} users with reminder time: ${currentHour}:00`);

            const today = new Date();
            today.setHours(0, 0, 0, 0);

            for (const user of users) {
                // Check if user has logged today
                const log = await HealthLog.findOne({
                    where: {
                        userId: user.id,
                        logDate: {
                            [Op.gte]: today
                        }
                    }
                });

                if (!log) {
                    console.log(`Sending reminder to ${user.email}`);
                    const html = `
                        <h2>Daily Health Reminder 🩺</h2>
                        <p>Hi ${user.name},</p>
                        <p>It's ${currentHour}:00 - time for your daily check-in!</p>
                        <p>We noticed you haven't logged your vitals today yet.</p>
                        <p>Consistency is key to tracking your health! Please take a moment to record your blood pressure, sugar, or weight.</p>
                        <br/>
                        <a href="${process.env.CLIENT_URL || 'http://localhost:5173'}/dashboard">Log Now</a>
                    `;
                    await sendEmail(user.email, 'Reminder: Log Your Vitals', html);
                }
            }
        } catch (error) {
            console.error('Error in Daily Log Reminder:', error);
        }
    });

    // Job 2: Appointment Reminder (Runs every day at 8:00 AM)
    cron.schedule('0 8 * * *', async () => {
        console.log('Running Appointment Check...');
        try {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const tomorrow = new Date(today);
            tomorrow.setDate(tomorrow.getDate() + 1);

            // Find doctors with appointments today
            const appointments = await Doctor.findAll({
                where: {
                    nextAppointment: {
                        [Op.between]: [today, tomorrow]
                    }
                },
                include: [{ model: User, as: 'user' }]
            });

            for (const appointment of appointments) {
                if (appointment.user && appointment.user.email) {
                    console.log(`Sending appointment reminder to ${appointment.user.email}`);
                    const html = `
                        <h2>Appointment Reminder 👨‍⚕️</h2>
                        <p>Hi ${appointment.user.name},</p>
                        <p>You have an appointment scheduled for <strong>today</strong> with <strong>${appointment.name}</strong> (${appointment.specialization}).</p>
                        <p>Notes: ${appointment.notes || 'None'}</p>
                    `;
                    await sendEmail(appointment.user.email, `Appointment Today: ${appointment.name}`, html);
                }
            }
        } catch (error) {
            console.error('Error in Appointment Reminder:', error);
        }
    });
    // Job 3: Medicine Reminder (Runs every hour)
    cron.schedule('0 * * * *', async () => {
        console.log('Running Hourly Medicine Check...');
        try {
            const now = new Date();
            const currentHour = now.getHours().toString().padStart(2, '0');
            const currentMinute = '00'; // Assuming hourly checks for exact hours
            const currentTime = `${currentHour}:${currentMinute}`;

            // Find medicines scheduled for this time
            const medicines = await Medicine.findAll({
                where: {
                    time: {
                        [Op.like]: `${currentHour}:%` // Matches 08:00, 08:30 etc if we want broad match, or strict
                    },
                    isActive: true
                },
                include: [{ model: User, attributes: ['email', 'name'] }]
            });

            // Filter for exact hour match if needed, or just send all for this hour
            // For MVP, let's say we check if the stored time starts with current hour

            console.log(`Found ${medicines.length} medicines scheduled for ${currentHour}:00 hour`);

            for (const med of medicines) {
                if (med.User && med.User.email) {
                    const subject = `Medicine Reminder: ${med.name}`;
                    const html = `
                        <h2>Time to take your medicine! 💊</h2>
                        <p>Hi ${med.User.name},</p>
                        <p>This is a reminder to take your scheduled medication:</p>
                        <div style="background-color: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0;">
                            <p><strong>Medicine:</strong> ${med.name}</p>
                            <p><strong>Dosage:</strong> ${med.dosage}</p>
                            <p><strong>Instructions:</strong> ${med.instructions || 'As prescribed'}</p>
                        </div>
                        <p>Stay healthy!</p>
                        <p>Health Tracker</p>
                    `;

                    await sendEmail(med.User.email, subject, html);
                    console.log(`Sent medicine reminder to ${med.User.email} for ${med.name}`);
                }
            }
        } catch (error) {
            console.error('Error in Medicine Reminder Job:', error);
        }
    });
};

module.exports = initCronJobs;
