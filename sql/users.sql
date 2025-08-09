-- Simple Users Table for Authentication
-- Run this in the Neon SQL Editor

CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Insert some sample data for testing
INSERT INTO users (username, email) VALUES
('johndoe', 'john@example.com'),
('janesmith', 'jane@example.com'),
('mikechen', 'mike@example.com')
ON CONFLICT (email) DO NOTHING;