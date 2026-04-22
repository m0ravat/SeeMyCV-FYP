-- Schema for SeeMyCV Application
-- This file documents the database schema structure
-- Run migrations to set up your database tables

-- Example: Users table structure (customize as needed)
-- CREATE TABLE users (
--   id SERIAL PRIMARY KEY,
--   email VARCHAR(255) UNIQUE NOT NULL,
--   name VARCHAR(255) NOT NULL,
--   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
--   updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
-- );

-- Example: CVs table structure
-- CREATE TABLE cvs (
--   id SERIAL PRIMARY KEY,
--   user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
--   title VARCHAR(255) NOT NULL,
--   content TEXT,
--   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
--   updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
-- );

-- Instructions for running migrations:
-- 1. Create SQL migration files in scripts/migrations/ directory
-- 2. Run them manually: psql -U user -d database_name -f migration_file.sql
-- 3. Or use a migration tool like flyway or migrate
