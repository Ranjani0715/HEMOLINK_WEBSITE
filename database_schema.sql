-- HemoLink MySQL Enterprise Schema
-- Optimized for Java Persistence API (JPA) Hibernate

CREATE DATABASE IF NOT EXISTS hemolink;
USE hemolink;

-- Users Table (Identity Management)
CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(255),
    role ENUM('DONOR', 'RECIPIENT', 'HOSPITAL', 'ADMIN'),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Donors Table (Medical & Availability Profile)
CREATE TABLE IF NOT EXISTS donors (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT,
    blood_group VARCHAR(5) NOT NULL,
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

-- Hospitals Table (Optional detail extension)
-- Note: Hospital data is primarily in 'users' with role 'HOSPITAL'.

-- Blood Inventory (Hospital Stock Tracking)
CREATE TABLE IF NOT EXISTS inventory (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    hospital_id BIGINT,
    blood_group VARCHAR(5),
    units INT,
    status ENUM('OPTIMAL', 'LOW', 'CRITICAL') DEFAULT 'OPTIMAL',
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (hospital_id) REFERENCES users(id)
);

-- Blood Requests Table (Critical SOS Module)
CREATE TABLE IF NOT EXISTS blood_requests (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    requester_id BIGINT,
    blood_type VARCHAR(5),
    units_required INT,
    priority ENUM('LOW', 'MEDIUM', 'HIGH', 'CRITICAL') DEFAULT 'LOW',
    hospital_name VARCHAR(255),
    patient_name VARCHAR(255),
    reason TEXT,
    status ENUM('PENDING', 'MATCHED', 'FULFILLED', 'CANCELLED') DEFAULT 'PENDING',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (requester_id) REFERENCES users(id)
);

-- Notifications (Real-time Broadcasts)
CREATE TABLE IF NOT EXISTS notifications (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT,
    message TEXT,
    is_read BOOLEAN DEFAULT FALSE,
    type VARCHAR(50),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Blood Camps (Nearby Drives)
CREATE TABLE IF NOT EXISTS blood_camps (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255),
    location VARCHAR(255),
    city VARCHAR(100),
    event_date DATETIME,
    organizer VARCHAR(255),
    description TEXT
);

-- Initial System Seeds
INSERT IGNORE INTO users (email, password, full_name, role) 
VALUES ('admin@hemolink.com', 'admin123', 'System Root Admin', 'ADMIN');

INSERT IGNORE INTO users (email, password, full_name, role) 
VALUES ('hospital@hemolink.com', 'hosp123', 'City General Hospital', 'HOSPITAL');
