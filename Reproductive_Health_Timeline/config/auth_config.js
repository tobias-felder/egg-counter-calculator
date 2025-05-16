const authConfig = {
    // Session configuration
    session: {
        secret: process.env.SESSION_SECRET,
        duration: 24 * 60 * 60 * 1000, // 24 hours
        activeDuration: 1000 * 60 * 5 // 5 minutes
    },

    // Authentication methods
    methods: {
        email: true,
        google: true,
        facebook: true,
        apple: true
    },

    // Password requirements
    passwordPolicy: {
        minLength: 8,
        requireUppercase: true,
        requireLowercase: true,
        requireNumbers: true,
        requireSpecialChars: true
    },

    // Token configuration
    tokens: {
        access: {
            secret: process.env.JWT_ACCESS_SECRET,
            expiresIn: '15m'
        },
        refresh: {
            secret: process.env.JWT_REFRESH_SECRET,
            expiresIn: '7d'
        }
    },

    // Security settings
    security: {
        maxLoginAttempts: 5,
        lockoutDuration: 15 * 60, // 15 minutes
        requireEmailVerification: true,
        twoFactorAuthEnabled: true,
        passwordResetTokenExpiry: 60 * 60, // 1 hour
    },

    // Rate limiting
    rateLimit: {
        windowMs: 15 * 60 * 1000, // 15 minutes
        max: 100 // limit each IP to 100 requests per windowMs
    }
};

module.exports = authConfig; 