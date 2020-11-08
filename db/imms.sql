drop database IF EXISTS imms;
create database imms;
use imms;
CREATE TABLE person
(   username varchar(50),
    password varchar(200),
    full_name varchar(50),
    role tinyint,
    active tinyint,
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
    subject_code varchar(10),
    program_code varchar(10),
    semester tinyint,
    FOREIGN KEY(subject_code) references subject(subject_code),
    FOREIGN KEY(program_code) references program(program_code)
);
CREATE TABLE section
(
    section_code varchar(10),
    PRIMARY KEY(section_code)
);

CREATE TABLE student
(   username varchar(50),
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
    PRIMARY KEY(username),
    FOREIGN KEY(username) references person(username)
);
CREATE TABLE teacher
(
    username varchar(50),
    PRIMARY KEY(username),
    FOREIGN KEY(username) references person(username)
);

CREATE TABLE lecture
(
    username varchar(50),
    section_code varchar(10),
    subject_code varchar(10),
    marks_submission_date DATE,
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
    FOREIGN KEY(username) references student(username),
    FOREIGN KEY(subject_code) references subject(subject_code)
);


INSERT INTO section(section_code) VALUES("074BCTAB");
INSERT INTO program(program_code,program_name,program_degree) VALUES("BCT","Computer Engineering","Bachelor");