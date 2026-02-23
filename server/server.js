const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

// Load environment variables
dotenv.config();

// Import database and models
const { testConnection, initDatabase } = require('./models');

// Import routes
const authRoutes = require('./routes/authRoutes');
const healthRoutes = require('./routes/healthRoutes');
const doctorRoutes = require('./routes/doctorRoutes');

// Import middleware
const { errorHandler, notFound } = require('./middleware/errorHandler');

// Initialize Express app
const app = express();

// Security middleware
app.use(helmet());
app.use(cors({
    origin: [
        'http://localhost:5173',
        'http://localhost:5174',
        'https://whitley-sternal-gillian.ngrok-free.dev',
        process.env.CLIENT_URL
    ],
    credentials: true
}));

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 500, // limit each IP to 500 requests per windowMs - Increased for polling
    message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', limiter);

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use('/uploads', express.static('uploads'));

// API Routes
app.get('/', (req, res) => {
    res.json({
        success: true,
        message: 'Welcome to Health Tracker API',
        version: '1.0.0',
        endpoints: {
            auth: '/api/auth',
            health: '/api/health',
            doctors: '/api/doctors',
            medicines: '/api/medicines'
        }
    });
});

app.use('/api/auth', authRoutes);
app.use('/api/health', healthRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/medicines', require('./routes/medicineRoutes'));
app.use('/api/ai', require('./routes/aiRoutes'));

// Error handling
app.use(notFound);
app.use(errorHandler);

// Server port
const PORT = process.env.PORT || 5000;

// Start server
const startServer = async () => {
    try {
        // Test database connection
        await testConnection();

        // Initialize database (create tables)
        await initDatabase(); // This will sync schema if NODE_ENV is development

        // Initialize Cron Jobs
        require('./services/cronService')();

        // Start listening
        app.listen(PORT, () => {
            console.log(`\n🚀 Server running on port ${PORT}`);
            console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
            console.log(`🌐 API URL: http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error('❌ Failed to start server:', error.message);
        process.exit(1);
    }
};

startServer();

module.exports = app;
