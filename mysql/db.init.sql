CREATE DATABASE IF NOT EXISTS `cafe_db`;

USE `cafe_db`;

GRANT ALL ON cafe_db.* TO 'sqluser'@'%';


DROP TABLE IF EXISTS cafes;

CREATE TABLE cafes(
    id BINARY(16) NOT NULL PRIMARY KEY,
    name varchar(255),
    logo int,
    location varchar(255),
    remarks varchar(255),
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

DROP TABLE IF EXISTS employees;

CREATE TABLE employees(
    id BINARY(16) NOT NULL PRIMARY KEY,
    name varchar(255),
    cafeId BINARY(16),
    remarks varchar(255),
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (cafeId) REFERENCES cafes(id) ON DELETE CASCADE 
);

-- DROP TABLE IF EXISTS work_schedule;
-- CREATE TABLE work_schedule(

-- );