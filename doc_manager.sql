-- ============================================================
-- NISU Document Tracking System (DTS)
-- Fresh Database Setup
-- Northern Iloilo State University
-- ============================================================

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";
SET NAMES utf8mb4;

-- ============================================================
-- Create & Use Database
-- ============================================================

CREATE DATABASE IF NOT EXISTS `doc_manager`
  DEFAULT CHARACTER SET utf8mb4
  COLLATE utf8mb4_general_ci;

USE `doc_manager`;

-- ============================================================
-- Table: logs (Regular Document Logs)
-- ============================================================

DROP TABLE IF EXISTS `logs`;
CREATE TABLE `logs` (
  `id`            INT(11)        NOT NULL AUTO_INCREMENT,
  `date_created`  DATE           NOT NULL,
  `office_campus` VARCHAR(255)   NOT NULL,
  `forwarded_by`  VARCHAR(255)   NOT NULL,
  `doc_type`      VARCHAR(255)   NOT NULL,
  `title`         VARCHAR(255)   NOT NULL,
  `amount`        DECIMAL(10,2)  NOT NULL DEFAULT 0.00,
  `received_by`   VARCHAR(255)   DEFAULT NULL,
  `forwarded_to`  VARCHAR(255)   DEFAULT NULL,
  `date_received` DATE           DEFAULT NULL,
  `status`        VARCHAR(50)    NOT NULL DEFAULT 'Pending',
  `created_at`    TIMESTAMP      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`    TIMESTAMP      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_general_ci;

-- ============================================================
-- Table: routed_logs (Routed/Incoming Document Logs)
-- ============================================================

DROP TABLE IF EXISTS `routed_logs`;
CREATE TABLE `routed_logs` (
  `id`         INT(11)       NOT NULL AUTO_INCREMENT,
  `doc_date`   DATE          NOT NULL,
  `doc_no`     VARCHAR(50)   NOT NULL,
  `sender`     VARCHAR(255)  NOT NULL,
  `subject`    VARCHAR(255)  NOT NULL,
  `recipient`  VARCHAR(255)  NOT NULL,
  `status`     VARCHAR(50)   NOT NULL DEFAULT 'Pending',
  `created_at` TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_general_ci;

-- ============================================================
-- Table: users
-- ============================================================

DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id`            INT(11)       NOT NULL AUTO_INCREMENT,
  `username`      VARCHAR(50)   NOT NULL,
  `email`         VARCHAR(100)  NOT NULL,
  `password_hash` VARCHAR(255)  NOT NULL,
  `first_name`    VARCHAR(50)   DEFAULT NULL,
  `last_name`     VARCHAR(50)   DEFAULT NULL,
  `is_active`     TINYINT(1)    NOT NULL DEFAULT 1,
  `created_at`    TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`    TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_username` (`username`),
  UNIQUE KEY `uq_email` (`email`)
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_general_ci;

-- ============================================================
-- Default Admin User
-- Username : admin
-- Password : admin123
-- (Change this password immediately after first login)
-- ============================================================

INSERT INTO `users`
  (`username`, `email`, `password_hash`, `first_name`, `last_name`, `is_active`)
VALUES
  (
    'admin',
    'admin@nisu.edu.ph',
    '$2y$12$7X7aVDQtmCaHPwTm7L3uyeQJjojXSCkuTBAsQzJ4h3EcPgArMoa8W',
    'Admin',
    'User',
    1
  );

-- ============================================================
-- Note: The password hash above corresponds to "admin123"
-- Change this after your first login! To generate a new hash:
--
--   php -r "echo password_hash('your_password', PASSWORD_BCRYPT, ['cost'=>12]);"
--
-- Replace the hash in the INSERT above with your own.
-- ============================================================

COMMIT;