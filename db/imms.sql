drop database IF EXISTS imms;
create database imms;
use imms;
CREATE TABLE person
(   
    person_id int NOT NULL PRIMARY KEY AUTO_INCREMENT,
    username varchar(50) NOT NULL UNIQUE,
    password varchar(200) NOT NULL,
    full_name varchar(50) NOT NULL,
    email varchar(50),
    phone_no varchar(20),
    role tinyint NOT NULL,
    status tinyint NOT NULL,
    created_at datetime DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE subject
(
    subject_id smallint NOT NULL PRIMARY KEY AUTO_INCREMENT,
    subject_code varchar(10) NOT NULL UNIQUE,
    title varchar(50) NOT NULL ,
    theory_fm tinyint NOT NULL,
    practical_fm tinyint NOT NULL,
    pass_percentage tinyint NOT NULL DEFAULT 40
);

CREATE TABLE program
(
    program_id tinyint NOT NULL PRIMARY KEY AUTO_INCREMENT,
    program_code varchar(10) NOT NULL UNIQUE,
    program_name varchar(100) NOT NULL,
    program_dept varchar(100) NOT NULL,
    program_degree varchar(50) NOT NULL
);
CREATE TABLE elective 
(
	id smallint NOT NULL PRIMARY KEY AUTO_INCREMENT,
    elective_id smallint NOT NULL,
    subject_id smallint NOT NULL,
    program_id tinyint NOT NULL,
    semester tinyint NOT NULL,
    FOREIGN KEY(elective_id) references subject(subject_id),
    FOREIGN KEY(subject_id) references subject(subject_id)
);
CREATE TABLE elective_choice
(
    id int NOT NULL PRIMARY KEY AUTO_INCREMENT,
    student_id int NOT NULL,
    elective_id smallint NOT NULL,
    subject_id smallint NOT NULL,
    FOREIGN KEY(elective_id) references subject(subject_id),
    FOREIGN KEY(subject_id) references subject(subject_id),
    FOREIGN KEY(student_id) references student(person_id),
    UNIQUE KEY(student_id,elective_id)
)
CREATE TABLE batch
(
    batch_id tinyint NOT NULL PRIMARY KEY AUTO_INCREMENT,
    batch_name varchar(5),
    semester tinyint NOT NULL
);
CREATE TABLE subject_in_program
(
    id int NOT NULL PRIMARY KEY AUTO_INCREMENT,
    program_id tinyint NOT NULL,
    subject_id smallint NOT NULL,
    semester tinyint,
    UNIQUE KEY(program_id,subject_id),
    FOREIGN KEY(subject_id) references subject(subject_id),
    FOREIGN KEY(program_id) references program(program_id)
);
CREATE TABLE section
(
    section_id smallint NOT NULL PRIMARY KEY AUTO_INCREMENT,
    section_code varchar(10) NOT NULL,
    batch_id tinyint NOT NULL,
    program_id tinyint NOT NULL,
    created_at datetime DEFAULT CURRENT_TIMESTAMP,
    status tinyint DEFAULT 1,
    FOREIGN KEY(batch_id) references batch(batch_id),
    FOREIGN KEY(program_id) references program(program_id)
);

CREATE TABLE student
(   
    person_id int NOT NULL PRIMARY KEY AUTO_INCREMENT,
    section_id smallint NOT NULL,
    program_id tinyint NOT NULL,
    FOREIGN KEY(person_id) references person(person_id),
    FOREIGN KEY(section_id) references section(section_id),
    FOREIGN KEY(program_id) references program(program_id)
);

CREATE TABLE admin
(
    person_id int NOT NULL PRIMARY KEY AUTO_INCREMENT,
    FOREIGN KEY(person_id) references person(person_id)
);
CREATE TABLE teacher
(
    person_id int NOT NULL PRIMARY KEY AUTO_INCREMENT,
    program_id tinyint NOT NULL,
    FOREIGN KEY(person_id) references person(person_id)
);

CREATE TABLE lecture
(
    lecture_id int NOT NULL PRIMARY KEY AUTO_INCREMENT,
    person_id int NOT NULL,
    section_id smallint NOT NULL,
    subject_id smallint NOT NULL,
    marks_entered tinyint NOT NULL DEFAULT 0,
    marks_submission_date DATE,
    assessment_date DATE,
    created_at datetime DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY(person_id,section_id,subject_id),
    FOREIGN KEY(person_id) references teacher(person_id),
    FOREIGN KEY(section_id) references section(section_id),
    FOREIGN KEY(subject_id) references subject(subject_id)
);
CREATE TABLE marks
(
    id int NOT NULL PRIMARY KEY AUTO_INCREMENT,
    person_id int NOT NULL,
    subject_id smallint NOT NULL,
    theory_marks tinyint NOT NULL DEFAULT 0,
    practical_marks tinyint NOT NULL DEFAULT 0,
    UNIQUE KEY(person_id,subject_id),
    FOREIGN KEY(person_id) references student(person_id),
    FOREIGN KEY(subject_id) references subject(subject_id)
);
CREATE TABLE notification
(
    id bigint NOT NULL PRIMARY KEY AUTO_INCREMENT,
    person_id int NOT NULL,
    message varchar(500),
    status tinyint NOT NULL DEFAULT 0,
    created_at datetime DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(person_id) references person(person_id)
);
CREATE TABLE lecture_session
(
    id int NOT NULL PRIMARY KEY AUTO_INCREMENT,
    lecture_id int NOT NULL,
    lecture_date datetime DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(lecture_id) references lecture(lecture_id)
);
CREATE TABLE attendance
(
    id bigint NOT NULL PRIMARY KEY AUTO_INCREMENT,
    lecture_session_id int NOT NULL,
    person_id int NOT NULL,
    attended tinyint NOT NULL DEFAULT 0,
    FOREIGN KEY(lecture_session_id) references lecture_session(id),
    FOREIGN KEY(person_id) references person(person_id)
);
CREATE TABLE logs
(
    id bigint NOT NULL PRIMARY KEY AUTO_INCREMENT,
    teacher_id int NOT NULL,
    student_id int NOT NULL,
    old_theory_marks tinyint NOT NULL,
    old_practical_marks tinyint NOT NULL,
    new_theory_marks tinyint NOT NULL,
    new_practical_marks tinyint NOT NULL,
    ip_address varchar(50),
    created_at datetime DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(teacher_id) references person(person_id),
    FOREIGN KEY(student_id) references person(person_id)
);
INSERT INTO batch(batch_name,semester) VALUES("074",7);