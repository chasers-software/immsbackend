drop database IF EXISTS imms;
create database imms;
use imms;
CREATE TABLE person
(   username varchar(50),
    password varchar(200),
    role tinyint,
    active tinyint,
    created_at datetime DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY(username)
);
CREATE TABLE subject
(
    subject_code varchar(10),
    title varchar(50),
    theory_fm tinyint,
    practical_fm tinyint,
    pass_percentage tinyint,
    PRIMARY KEY(subject_code)
);
CREATE TABLE program
(
    program_code varchar(10),
    program_name varchar(50),
    program_degree varchar(50),
    PRIMARY KEY(program_code)
);
CREATE TABLE subject_in_program
(
    program_code varchar(10),
    subject_code varchar(10),
    semester tinyint,
    PRIMARY KEY(program_code,subject_code),
    FOREIGN KEY(subject_code) references subject(subject_code),
    FOREIGN KEY(program_code) references program(program_code)
);
CREATE TABLE section
(
    section_code varchar(10),
    created_at datetime DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY(section_code)
);

CREATE TABLE student
(   username varchar(50),
    full_name varchar(50),
    section_code varchar(10),
    program_code varchar(10),
    PRIMARY KEY(username),
    FOREIGN KEY(username) references person(username),
    FOREIGN KEY(section_code) references section(section_code),
    FOREIGN KEY(program_code) references program(program_code)
);

CREATE TABLE admin
(
    username varchar(50),
    full_name varchar(50),
    PRIMARY KEY(username),
    FOREIGN KEY(username) references person(username)
);
CREATE TABLE teacher
(
    username varchar(50),
    full_name varchar(50),
    email varchar(50),
    phone_no varchar(15),
    program_code varchar(10),
    PRIMARY KEY(username),
    FOREIGN KEY(username) references person(username)
);

CREATE TABLE lecture
(
    username varchar(50),
    section_code varchar(10),
    subject_code varchar(10),
    marks_submission_date DATE,
    created_at datetime DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY(username,section_code,subject_code),
    FOREIGN KEY(username) references teacher(username),
    FOREIGN KEY(section_code) references section(section_code),
    FOREIGN KEY(subject_code) references subject(subject_code)
);
CREATE TABLE marks
(
    username varchar(50),
    subject_code varchar(10),
    theory_marks tinyint,
    practical_marks tinyint,
    PRIMARY KEY(username,subject_code),
    FOREIGN KEY(username) references student(username),
    FOREIGN KEY(subject_code) references subject(subject_code)
);
