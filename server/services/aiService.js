const Groq = require('groq-sdk');
const dotenv = require('dotenv');

dotenv.config();

let groq;
try {
    if (process.env.GROQ_API_KEY) {
        groq = new Groq({
            apiKey: process.env.GROQ_API_KEY
        });
    } else {
        console.warn('⚠️ GROQ_API_KEY is missing. AI features will use mock responses.');
    }
} catch (error) {
    console.error('Error initializing Groq SDK:', error);
}

/**
 * Get chat completion from Groq AI
 * @param {string} userMessage - The user's prompt
 * @param {string} systemContext - Context about the user's health
 * @param {Array} images - Array of base64 image objects (optional)
 * @returns {Promise<string>} - The AI's response
 */
const getChatCompletion = async (userMessage, systemContext, images = []) => {
    // Return mock response if no API key
    if (!groq) {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(`[MOCK AI] I see you asked: "${userMessage}". \n\nSince no API key is configured, I can't generate a real medical insight, but I can tell you that your recent health logs look interesting! Please add a GROQ_API_KEY to your .env file to unlock my full potential.`);
            }, 1000);
        });
    }

    try {
        const hasImages = images.length > 0;

        // Construct user message content
        let userContent;
        if (hasImages) {
            userContent = [
                { type: "text", text: userMessage },
                ...images
            ];
        } else {
            userContent = userMessage;
        }

        const completion = await groq.chat.completions.create({
            messages: [
                {
                    role: 'system',
                    content: `You are Dr. AI, a helpful and empathetic health assistant. 
                    You have access to the user's recent health data: ${systemContext}.
                    
                    Rules:
                    1. Provide concise, encouraging, and actionable advice.
                    2. If values are abnormal (e.g., high BP/sugar), suggest consulting a real doctor immediately.
                    3. Keep responses under 200 words unless asked for details.
                    4. Format your response with markdown (bolding key terms).
                    5. If images are provided, they are likely prescriptions or medical reports. Analyze them if asked.`
                },
                {
                    role: 'user',
                    content: userContent
                }
            ],
            // Use Vision model if images are present, otherwise standard Llama
            model: hasImages ? 'llama-3.2-90b-vision-preview' : 'llama-3.3-70b-versatile',
            temperature: 0.7,
            max_tokens: 1024,
        });

        return completion.choices[0]?.message?.content || "I couldn't generate a response at this time.";
    } catch (error) {
        console.error('Groq API Error Details:', JSON.stringify(error, null, 2));
        // Fallback to Mixtral if Llama fails? Or just return a user-friendly error
        if (error.status === 401) return "Error: Invalid API Key. Please check your configuration.";
        if (error.status === 429) return "Error: Rate limit exceeded. Please try again later.";

        throw new Error(`AI Service Error: ${error.message}`);
    }
};

module.exports = {
    getChatCompletion
};
