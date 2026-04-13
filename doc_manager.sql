-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Feb 10, 2026 at 01:27 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `doc_manager`
--
CREATE DATABASE IF NOT EXISTS `doc_manager` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `doc_manager`;

-- --------------------------------------------------------

--
-- Table structure for table `logs`
--

CREATE TABLE IF NOT EXISTS `logs` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `date_created` date NOT NULL,
  `office_campus` varchar(255) NOT NULL,
  `forwarded_by` varchar(255) NOT NULL,
  `doc_type` varchar(255) NOT NULL,
  `title` varchar(255) NOT NULL,
  `amount` decimal(10,2) DEFAULT 0.00,
  `received_by` varchar(255) DEFAULT NULL,
  `forwarded_to` varchar(255) DEFAULT NULL,
  `date_received` date DEFAULT NULL,
  `status` varchar(50) DEFAULT 'Pending',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=30 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `logs`
--

INSERT INTO `logs` (`id`, `date_created`, `office_campus`, `forwarded_by`, `doc_type`, `title`, `amount`, `received_by`, `forwarded_to`, `date_received`, `status`, `created_at`, `updated_at`) VALUES
(1, '2023-10-01', 'Main Campus - OSAS', 'John Doe', 'Purchase Request', 'Purchase of Office Supplies for Q4', 15000.00, 'Jane Smith', 'Budget Office', '2023-10-02', 'Received', '2026-01-29 01:15:51', '2026-01-29 01:15:51'),
(2, '2023-10-02', 'External Campus - Registrar', 'Maria Garcia', 'Travel Order', 'Travel to Regional Conference', 0.00, 'Admin Staff', 'HR Office', '2023-10-03', 'Pending', '2026-01-29 01:15:51', '2026-01-29 01:15:51'),
(3, '2023-10-03', 'Main Campus - Accounting', 'Robert Johnson', 'Voucher', 'Payment for Internet Subscription', 3500.50, 'Finance Head', 'Cashier', NULL, 'Released', '2026-01-29 01:15:51', '2026-01-29 01:15:51'),
(4, '2023-10-04', 'Main Campus - HR', 'Sarah Williams', 'Memorandum', 'Holiday Schedule Announcement', 0.00, 'All Depts', 'All Staff', '2023-10-04', 'Received', '2026-01-29 01:15:51', '2026-01-29 01:15:51'),
(5, '2023-10-05', 'Main Campus - IT', 'Michael Brown', 'Purchase Request', 'Procurement of New Servers', 120000.00, 'Jane Smith', 'Budget Office', NULL, 'Pending', '2026-01-29 01:15:51', '2026-01-29 01:15:51'),
(6, '2023-10-06', 'External Campus - Library', 'Emily Davis', 'Letter', 'Request for Book Donation', 0.00, 'President', 'External Affairs', '2023-10-07', 'Pending', '2026-01-29 01:15:51', '2026-01-29 01:27:17'),
(7, '2023-10-07', 'Main Campus - Supply', 'David Wilson', 'Inventory Report', 'Annual Inventory Report 2023', 0.00, 'Auditor', 'COA', '0000-00-00', 'Released', '2026-01-29 01:15:51', '2026-01-29 05:15:25'),
(8, '2023-10-08', 'Main Campus - Engineering', 'James Miller', 'Proposal', 'Renovation of Lab 101', 500000.00, 'Plan. Dev.', 'Budget Office', '2023-10-09', 'Pending', '2026-01-29 01:15:51', '2026-01-29 05:42:27'),
(9, '2023-10-09', 'Main Campus - Clinic', 'Patricia Taylor', 'Purchase Request', 'Medical Supplies Restock', 5000.00, 'Jane Smith', 'Budget Office', '2026-01-28', 'Pending', '2026-01-29 01:15:51', '2026-01-29 05:42:35'),
(10, '2023-10-10', 'External Campus - Dean', 'Linda Anderson', 'Travel Order', 'Site Visit to Extension Project', 2500.00, 'Admin Staff', 'HR Office', '2023-10-11', 'Pending', '2026-01-29 01:15:51', '2026-01-29 01:27:00'),
(11, '2023-10-11', 'Main Campus - President', 'Jennifer Thomas', 'Memorandum', 'Policy on Remote Work', 0.00, 'All Depts', 'All Staff', '2023-10-11', 'Released', '2026-01-29 01:15:51', '2026-01-29 01:15:51'),
(12, '2023-10-12', 'Main Campus - Cashier', 'Charles Jackson', 'Proposal', 'Monthly Collection Report - Sept', 0.00, 'Accounting', 'Finance Head', '2023-10-13', 'Pending', '2026-01-29 01:15:51', '2026-01-29 05:07:42'),
(13, '2023-10-13', 'Main Campus - Alumni', 'Christopher White', 'Letter', 'Invitation to Alumni Homecoming', 0.00, 'President', 'Public Info', '2026-01-12', 'Pending', '2026-01-29 01:15:51', '2026-01-29 05:42:39'),
(14, '2023-10-14', 'External Campus - Guard', 'Daniel Harris', 'Incident Report', 'Report on Gate 2 Damage', 0.00, 'Security Head', 'Admin Office', '2023-10-14', 'Pending', '2026-01-29 01:15:51', '2026-01-29 04:46:08'),
(15, '2023-10-15', 'Main Campus - Research', 'Matt Martin', 'Research Proposal', 'Sustainable Agriculture Study', 75000.00, 'Research Dir', 'Funding Agency', NULL, 'Released', '2026-01-29 01:15:51', '2026-01-29 04:56:07'),
(16, '2023-10-16', 'Main Campus - Extension', 'Anthony Thompson', 'Activity Design', 'Community Outreach Program', 15000.00, 'Extension Dir', 'Budget Office', '2023-10-17', 'Pending', '2026-01-29 01:15:51', '2026-01-29 02:54:55'),
(17, '2023-10-17', 'Main Campus - Guidance', 'Mark Garcia', 'Purchase Request', 'Guidance Counseling Materials', 3000.00, 'Jane Smith', 'Budget Office', NULL, 'Pending', '2026-01-29 01:15:51', '2026-01-29 01:15:51'),
(18, '2023-10-18', 'External Campus - Faculty', 'Elizabeth Martinez', 'Proposal', 'Sick Leave - 3 Days', 0.00, 'Dean', 'HR Office', '2023-10-18', 'Pending', '2026-01-29 01:15:51', '2026-01-29 05:13:03'),
(19, '2023-10-19', 'Main Campus - Quality Assurance', 'Joshusa Robinson', 'Audit Report', 'ISO Internal Audit Findings', 0.00, 'President', 'All Depts', '2023-10-20', 'Released', '2026-01-29 01:15:51', '2026-01-29 04:56:00'),
(20, '2023-10-20', 'Main Campus - Sports', 'Andrew Clark', 'Purchase Request', 'Sports Equipment for Meet', 45000.00, 'Jane Smith', 'Budget Office', NULL, 'Pending', '2026-01-29 01:15:51', '2026-01-29 01:15:51'),
(21, '2023-10-21', 'Main Campus - Arts', 'Ryan Rodriguez', 'Proposal', 'Annual Arts Festival', 20000.00, 'Student Affairs', 'Budget Office', '2023-10-22', 'Released', '2026-01-29 01:15:51', '2026-01-30 00:33:03'),
(22, '2023-10-22', 'External Campus - Admin', 'Kevin Lewis', 'Endorsement/Indorsement', 'Utility Bills Payment', 12000.00, 'Finance Head', 'Cashier', '0000-00-00', 'Forwarded', '2026-01-29 01:15:51', '2026-01-29 06:09:02'),
(23, '2023-10-23', 'Main Campus - Registrar', 'Jessica Lee', 'Proposal', '1st Semester Enrollment Data', 0.00, 'VP Academics', 'CHED', '2023-10-24', 'Released', '2026-01-29 01:15:51', '2026-01-29 02:59:21'),
(24, '2023-10-24', 'Main Campus - HR', 'Brian Walker', 'Proposal', 'Staff Development Seminar', 50000.00, 'President', 'Budget Office', '0000-00-00', 'Pending', '2026-01-29 01:15:51', '2026-01-30 00:47:58'),
(25, '2023-10-25', 'Main Campus - Procurement', 'Edward Hall', 'Proposal', 'shit', 0.00, 'BAC', 'Contractors', '2023-10-25', 'Disapproved', '2026-01-29 01:15:51', '2026-01-30 00:47:58'),
(26, '2026-01-29', 'khglgfyi', 'Sir Anrem', 'DTR', 'HAHAHAHAHA', 0.00, '', '', '2026-01-29', 'Disapproved', '2026-01-29 05:25:23', '2026-01-30 01:08:55'),
(27, '2026-01-29', 'West', 'remnhgfhygdythdtdyj', 'mnzxdcnzdn', 'Basta basta basta', 1111.00, '', '', '2026-01-06', 'Delivered', '2026-01-29 05:34:39', '2026-01-30 00:50:34'),
(28, '2026-01-30', 'VPRE', 'jhghg', 'Contract', 'NVSHJVSHJS', 0.00, '', '', NULL, 'Disapproved', '2026-01-29 06:49:00', '2026-01-30 01:08:56'),
(29, '2026-01-30', ', mnmnbbnbm,', 'Sir Anrem', 'lknm,b', 'kn bjm n', 0.00, '', '', NULL, 'Pending', '2026-01-30 00:36:50', '2026-01-30 00:36:54');

-- --------------------------------------------------------

--
-- Table structure for table `routed_logs`
--

CREATE TABLE IF NOT EXISTS `routed_logs` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `doc_date` date NOT NULL,
  `doc_no` varchar(50) NOT NULL,
  `sender` varchar(255) NOT NULL,
  `subject` varchar(255) NOT NULL,
  `recipient` varchar(255) NOT NULL,
  `status` varchar(50) DEFAULT 'Pending',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `routed_logs`
--

INSERT INTO `routed_logs` (`id`, `doc_date`, `doc_no`, `sender`, `subject`, `recipient`, `status`, `created_at`, `updated_at`) VALUES
(1, '2026-01-29', 'sdfcds', 'xvxdvc', 'vxfvxd', 'vxdvxdv', 'Pending', '2026-01-29 06:46:30', '2026-01-29 06:46:30'),
(2, '2026-01-29', 'bbnbnb', 'sdvsd', 'SDCSDC', 'SDCS', 'Pending', '2026-01-29 07:04:41', '2026-01-29 07:04:41'),
(3, '2026-01-29', '223232wvc', 'dsohsvhsdfjdjfjdzfjdjlfdjlfcjdxc dkbjfsdgui fs', 'jkgdfdzgcgh zskjdgfsgjdgjkdesd', 'jlksjdsgjldjs elkjfdjdhlsdui  sdkjbjdzgjzsgdzgd fdsgjfdjk', 'Pending', '2026-01-29 07:13:15', '2026-01-30 00:53:54');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE IF NOT EXISTS `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `first_name` varchar(50) DEFAULT NULL,
  `last_name` varchar(50) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `is_active` tinyint(1) DEFAULT 1,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `username`, `email`, `password_hash`, `first_name`, `last_name`, `created_at`, `updated_at`, `is_active`) VALUES
(1, 'admin', 'admin@nisu.edu.ph', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Admin', 'User', '2026-01-29 00:59:45', '2026-01-29 00:59:45', 1),
(2, 'admin', '', '$2y$12$vwZBJRn2y0MA08Q/dRk8PuVpeCqRC9U7xrMG6ScJ06oRqdkBaoUYS', NULL, NULL, '2026-01-29 01:15:51', '2026-01-29 01:15:51', 1);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
