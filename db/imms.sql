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
    avatar varchar(500),
    role tinyint NOT NULL DEFAULT 2,
    status tinyint NOT NULL DEFAULT 1,
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
    program_degree varchar(50) NOT NULL,
    sections tinyint DEFAULT 1
);
CREATE TABLE dept
(
    dept_id tinyint NOT NULL PRIMARY KEY AUTO_INCREMENT,
    dept_name varchar(100) NOT NULL
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

CREATE TABLE batch
(
    batch_id tinyint NOT NULL PRIMARY KEY AUTO_INCREMENT,
    batch_code varchar(5),
    semester tinyint NOT NULL,
    deadline DATE
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
    section_code varchar(15) NOT NULL,
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
    batch_id tinyint NOT NULL,
    FOREIGN KEY(person_id) references person(person_id),
    FOREIGN KEY(section_id) references section(section_id),
    FOREIGN KEY(program_id) references program(program_id)
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
);
CREATE TABLE admin
(
    person_id int NOT NULL PRIMARY KEY AUTO_INCREMENT,
    FOREIGN KEY(person_id) references person(person_id)
);
CREATE TABLE teacher
(
    person_id int NOT NULL PRIMARY KEY AUTO_INCREMENT,
    dept_id tinyint NOT NULL,
    FOREIGN KEY(person_id) references person(person_id),
    FOREIGN KEY(dept_id) references dept(dept_id)
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
    avg_theory tinyint DEFAULT 0,
    avg_practical tinyint DEFAULT 0,
    total_theory_pass tinyint DEFAULT 0,
    total_practical_pass tinyint DEFAULT 0,
    created_at datetime DEFAULT CURRENT_TIMESTAMP,
    status tinyint DEFAULT 1,
    UNIQUE KEY(person_id,section_id,subject_id,status),
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
    sender_id int NOT NULL,
    receiver_id int NOT NULL,
    subject_id smallint NOT NULL,
    message varchar(500),
    type tinyint NOT NULL DEFAULT 0,
    status tinyint NOT NULL DEFAULT 0,
    created_at datetime DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(sender_id) references person(person_id),
    FOREIGN KEY(receiver_id) references person(person_id),
     FOREIGN KEY(subject_id) references subject(subject_id)
);
CREATE TABLE post
(
    id bigint NOT NULL PRIMARY KEY AUTO_INCREMENT,
    person_id int NOT NULL,
    section_id smallint NOT NULL,
    content varchar(1000),
    created_at datetime DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(person_id) references person(person_id),
    FOREIGN KEY(section_id) references section(section_id)
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
INSERT INTO person(username,password,full_name,email,phone_no,role,status) 
values("a1","$2b$12$1.E9cUM58WU4DuHxTPz9Vu/0wxJsYqDpqZFxJUxKSxuZ/kfjnTnkG","Admin One","a1@abc.com","9849657135",0,1);
INSERT INTO admin(person_id) values(1);
INSERT INTO program(program_code,program_name,program_dept,program_degree,sections)
VALUES("BCT","Bachelor of Computer Engineering","Department of Electronics and Computer Engineering","Bachelor",2),
    ("BCE","Bachelor of Civil Engineering","Department of Civil Engineering","Bachelor",4),
    ("BME","Bachelor of Mechanical Engineering","Department of Mechanical Engineering","Bachelor",1),
    ("BEX","Bachelor of Electronics Engineering","Department of Electronics and Computer Engineering","Bachelor",1);
INSERT INTO dept(dept_name)
values("Department of Electronics and Computer Engineering"),
	("Department of Civil Engineering"),
    ("Department of Mechanical Engineering"),
    ("Department of Electrical Engineering");