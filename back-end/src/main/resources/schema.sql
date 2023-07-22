CREATE TABLE IF NOT EXISTS Message(

                                      id INT AUTO_INCREMENT PRIMARY KEY ,
                                      date DATE NOT NULL ,
                                      name VARCHAR(200) NOT NULL ,
                                      email VARCHAR(400) NOT NULL ,
                                      message VARCHAR(800) NOT NULL

);

ALTER TABLE Message ADD  organization VARCHAR(200);


CREATE TABLE IF NOT EXISTS FileNames(
    id INT AUTO_INCREMENT PRIMARY KEY ,
   email VARCHAR(400) NOT NULL ,
    fileName VARCHAR(300)NOT NULL
);

DROP TABLE IF EXISTS Message;