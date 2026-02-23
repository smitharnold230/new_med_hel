const { getChatCompletion } = require('../services/aiService');
const { HealthLog, User, Medicine, Doctor, Prescription } = require('../models');
const fs = require('fs');
const path = require('path');

/**
 * @desc    Chat with AI Health Assistant
 * @route   POST /api/ai/chat
 * @access  Private
 */
const chatWithAI = async (req, res, next) => {
    try {
        const { message } = req.body;

        if (!message) {
            return res.status(400).json({
                success: false,
                message: 'Message is required'
            });
        }

        // Format context string
        let context = `User Name: ${req.user.name}\nUser Health Profile:\n`;

        // Only fetch and add context if user has allowed AI data access
        if (req.user.aiDataAccess) {
            // Fetch recent health logs to build context
            const recentLogs = await HealthLog.findAll({
                where: { userId: req.user.id },
                order: [['logDate', 'DESC']],
                limit: 5,
                attributes: ['logDate', 'systolic', 'diastolic', 'bloodSugar', 'weight', 'heartRate']
            });

            // Fetch active medicines
            const medicines = await Medicine.findAll({
                where: { userId: req.user.id, isActive: true }
            });

            // Fetch recent prescriptions (e.g., last 6 months)
            const doctors = await Doctor.findAll({
                where: { userId: req.user.id },
                attributes: ['id']
            });

            const doctorIds = doctors.map(d => d.id);

            const prescriptions = await Prescription.findAll({
                where: { doctorId: doctorIds },
                order: [['date', 'DESC']],
                limit: 5
            });

            // Process prescription images
            const images = [];
            for (const script of prescriptions) {
                if (script.file_path) {
                    try {
                        const absolutePath = path.join(__dirname, '..', script.file_path);
                        if (fs.existsSync(absolutePath)) {
                            const fileExt = path.extname(absolutePath).toLowerCase().replace('.', '');
                            if (['jpg', 'jpeg', 'png', 'webp'].includes(fileExt)) {
                                const imageBuffer = fs.readFileSync(absolutePath);
                                const base64Image = imageBuffer.toString('base64');
                                images.push({
                                    type: 'image_url',
                                    image_url: { url: `data:image/${fileExt};base64,${base64Image}` }
                                });
                            }
                        }
                    } catch (err) {
                        console.error(`Error reading prescription file ID ${script.id}:`, err);
                    }
                }
            }

            if (medicines.length > 0) {
                context += "Current Medications:\n";
                medicines.forEach(m => {
                    context += `- ${m.name} (${m.dosage}, ${m.frequency})\n`;
                });
                context += "\n";
            }

            if (recentLogs.length > 0) {
                context += "Recent Health Logs:\n";
                recentLogs.forEach(log => {
                    context += `- Date: ${log.logDate}, BP: ${log.systolic}/${log.diastolic}, Sugar: ${log.bloodSugar} mg/dL, Weight: ${log.weight} kg, Heart Rate: ${log.heartRate} bpm\n`;
                });
            } else {
                context += "No recent health logs available.\n";
            }

            if (images.length > 0) {
                context += `\n[System Note: The user has ${images.length} prescription image(s) attached to this request. Analyze them if relevant to the user's question.]\n`;
            }

            // Get AI response with context
            const aiResponse = await getChatCompletion(message, context, images);
            return res.status(200).json({ success: true, response: aiResponse });
        }

        // If data access is disabled, send prompt without health context
        context += "AI Data Access is DISABLED in user settings. Do not reference any personal health logs, medications, or prescriptions as you do not have access to them. Focus only on the direct question.";
        const aiResponse = await getChatCompletion(message, context, []);

        res.status(200).json({
            success: true,
            response: aiResponse
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Generate health insights (One-click analysis)
 * @route   GET /api/ai/insights
 * @access  Private
 */
const getHealthInsights = async (req, res, next) => {
    try {
        if (!req.user.aiDataAccess) {
            return res.status(200).json({
                success: true,
                response: "AI Data Access is currently disabled. Please enable it in Settings to allow me to analyze your health trends and provide personalized insights."
            });
        }

        // Fetch more logs for better trend analysis
        const logs = await HealthLog.findAll({
            where: { userId: req.user.id },
            order: [['logDate', 'DESC']],
            limit: 10,
        });

        if (logs.length === 0) {
            return res.status(200).json({
                success: true,
                response: "You haven't logged any health data yet. Please log some vitals so I can analyze your trends!"
            });
        }

        let context = `User Name: ${req.user.name}\nAnalyze the following health trends and provide a summary:\n`;
        logs.forEach(log => {
            context += `- Date: ${log.logDate}, BP: ${log.systolic}/${log.diastolic}, Sugar: ${log.bloodSugar}, Weight: ${log.weight}\n`;
        });

        const message = "Please analyze my recent health trends. Are there any concerning patterns? What should I focus on? Keep it brief.";

        const aiResponse = await getChatCompletion(message, context);

        res.status(200).json({
            success: true,
            response: aiResponse
        });

    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Check medication safety/interactions
 * @route   POST /api/ai/safety-check
 * @access  Private
 */
const checkMedicationSafety = async (req, res, next) => {
    try {
        const { newMedicine } = req.body;

        if (!newMedicine) {
            return res.status(400).json({
                success: false,
                message: 'New medicine name is required'
            });
        }

        // Fetch active medicines for context
        const activeMedicines = await Medicine.findAll({
            where: { userId: req.user.id, isActive: true }
        });

        let context = `User Name: ${req.user.name}\n`;
        context += `Goal: Evaluate the safety of adding "${newMedicine}" to the user's current medication regimen.\n\n`;

        if (activeMedicines.length > 0) {
            context += "Current Active Medications:\n";
            activeMedicines.forEach(m => {
                context += `- ${m.name} (${m.dosage}, ${m.frequency})\n`;
            });
        } else {
            context += "The user has no currently logged active medications.\n";
        }

        const message = `Is it safe for me to take "${newMedicine}" given my current medications? Please analyze potential drug-drug interactions, contraindications, and provide a clear safety assessment. 

IMPORTANT: Start your response with a clear "SAFETY RATING" (e.g., SAFE, CAUTION, or CONSULT DOCTOR). Use Markdown formatting. 

DISCLAIMER: Always include a mandatory statement that this is for informational purposes and the user MUST consult a healthcare professional before starting new medication.`;

        const aiResponse = await getChatCompletion(message, context);

        res.status(200).json({
            success: true,
            response: aiResponse
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    chatWithAI,
    getHealthInsights,
    checkMedicationSafety
};
