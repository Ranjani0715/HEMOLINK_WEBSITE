CREATE DATABASE IF NOT EXISTS hemolink_db;
USE hemolink_db;

CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(100),
    role ENUM('DONOR', 'RECIPIENT', 'HOSPITAL', 'ADMIN'),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE donors (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT,
    blood_group VARCHAR(5),
    age INT,
    gender VARCHAR(10),
    phone_number VARCHAR(20),
    address TEXT,
    city VARCHAR(100),
    state VARCHAR(100),
    pincode VARCHAR(10),
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    medical_history TEXT,
    weight DECIMAL(5, 2),
    last_donation_date DATETIME,
    is_available BOOLEAN DEFAULT TRUE,
    trust_score INT DEFAULT 70,
    reward_points INT DEFAULT 0,
    total_donations INT DEFAULT 0,
    total_lives_saved INT DEFAULT 0,
    verification_status ENUM('PENDING', 'VERIFIED', 'REJECTED') DEFAULT 'PENDING',
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE blood_camps (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255),
    location VARCHAR(255),
    city VARCHAR(100),
    event_date DATETIME,
    organizer VARCHAR(255),
    description TEXT
);

CREATE TABLE blood_requests (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    requester_id BIGINT,
    blood_type VARCHAR(5),
    units_required INT,
    emergency_level ENUM('LOW', 'MEDIUM', 'HIGH', 'CRITICAL'),
    hospital_name VARCHAR(255),
    status ENUM('PENDING', 'MATCHED', 'FULFILLED', 'CANCELLED'),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (requester_id) REFERENCES users(id)
);
