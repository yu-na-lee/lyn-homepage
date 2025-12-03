create database 202445007_schema;
use 202445007_schema;

CREATE TABLE User (
    user_id VARCHAR(20) PRIMARY KEY,        
    name VARCHAR(50) NOT NULL,  
    major VARCHAR(100),           
    email VARCHAR(100) UNIQUE,       
    self_introduction TEXT   
);

CREATE TABLE Project (
    proj_id INT PRIMARY KEY AUTO_INCREMENT, 
    user_id VARCHAR(20) NOT NULL,           
    title VARCHAR(200) NOT NULL,         
    period VARCHAR(50),                     
    description TEXT,                  
    project_link VARCHAR(255),             
    FOREIGN KEY (user_id) REFERENCES User(user_id)
);

CREATE TABLE Skill (
    skill_id INT PRIMARY KEY AUTO_INCREMENT,
    skill_name VARCHAR(100) UNIQUE NOT NULL, 
    category VARCHAR(50),                   
    proficiency INT DEFAULT 1                
);

CREATE TABLE Proj_Skill (
    proj_id INT NOT NULL,
    skill_id INT NOT NULL,
    PRIMARY KEY (proj_id, skill_id), 
    FOREIGN KEY (proj_id) REFERENCES Project(proj_id),
    FOREIGN KEY (skill_id) REFERENCES Skill(skill_id)
);