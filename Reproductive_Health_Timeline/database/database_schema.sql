-- Users Table
CREATE TABLE users (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    date_of_birth DATE,
    subscription_tier ENUM('free', 'basic', 'premium', 'professional') DEFAULT 'free',
    subscription_status ENUM('active', 'cancelled', 'expired') DEFAULT 'active',
    subscription_start_date DATETIME,
    subscription_end_date DATETIME,
    last_login DATETIME,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Authentication Table
CREATE TABLE auth_tokens (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    token VARCHAR(255) NOT NULL,
    device_info VARCHAR(255),
    ip_address VARCHAR(45),
    expires_at DATETIME NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Egg Count Calculations Table
CREATE TABLE egg_calculations (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    age INT NOT NULL,
    current_egg_count_range VARCHAR(50),
    past_egg_count_range VARCHAR(50),
    future_egg_count_range VARCHAR(50),
    past_percentage_change DECIMAL(5,2),
    future_percentage_change DECIMAL(5,2),
    calculation_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Menstrual Cycle Tracking Table
CREATE TABLE menstrual_cycles (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    cycle_start_date DATE NOT NULL,
    cycle_length INT DEFAULT 28,
    ovulation_date DATE,
    next_period_date DATE,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Subscription Plans Table
CREATE TABLE subscription_plans (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    billing_cycle ENUM('monthly', 'yearly') NOT NULL,
    features JSON NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User Payments Table
CREATE TABLE payments (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    subscription_plan_id BIGINT NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    payment_status ENUM('pending', 'completed', 'failed') NOT NULL,
    payment_method VARCHAR(50),
    transaction_id VARCHAR(255),
    payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (subscription_plan_id) REFERENCES subscription_plans(id)
);

-- User Settings Table
CREATE TABLE user_settings (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    notification_preferences JSON,
    privacy_settings JSON,
    data_retention_period INT DEFAULT 365, -- days
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create indexes for better performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_auth_tokens_user_id ON auth_tokens(user_id);
CREATE INDEX idx_egg_calculations_user_id ON egg_calculations(user_id);
CREATE INDEX idx_menstrual_cycles_user_id ON menstrual_cycles(user_id); 