drop table if exists testaus;
CREATE TABLE testaus
(
  kayttaja VARCHAR(30),
  test VARCHAR(30)
);

drop table if exists testaus2;
CREATE TABLE testaus2
(
  kuva_id INT NOT NULL,
  URL VARCHAR(50),
  kuva_teksti VARCHAR(50),
  PRIMARY KEY (kuva_id)
);

drop table if exists testaus3;
CREATE TABLE testaus3
(
  kayttaja VARCHAR(100),
  test VARCHAR(100)
);


drop table if exists cssTiedostot;
CREATE TABLE cssTiedostot
(
  nimi VARCHAR(100),
  CSS_Tiedosto TEXT,
  Width INT,
  Height INT,
  Max_width INT,
  Min_width INT,
  Max_Height INT,
  Min_Height INT
);

/* Taulu mihin tallennetaan CSS tiedostot ja niiden sisältö*/
drop table if exists cssTiedostot2;
CREATE TABLE cssTiedostot2
(
  CSS_Id int NOT NULL AUTO_INCREMENT,
  nimi VARCHAR(100),
  CSS_Tiedosto TEXT,
  PRIMARY KEY (CSS_Id)
);
ALTER TABLE `cssTiedostot2` MODIFY `CSS_Tiedosto` LONGTEXT

drop table if exists mediaQuerySaannot;

CREATE TABLE mediaQuerySaannot
(
    MediaQuery_Saanto TEXT,
    Max_width VARCHAR(20),
    Min_width VARCHAR(20),
    Max_Height VARCHAR(20),
    Min_Height VARCHAR(20)
);

drop table if exists mediaQuerySaannot2;
CREATE TABLE mediaQuerySaannot2
(
    CSS_File VARCHAR(100),
    MediaQuery_Saanto1 TEXT,
    MediaQuery_Saanto2 TEXT,
    Position INT,
    lengthType VARCHAR(20),
    width VARCHAR(20),
    height VARCHAR(20)
);

ALTER TABLE `mediaQuerySaannot2` MODIFY `MediaQuery_Saanto1` LONGTEXT;
ALTER TABLE `mediaQuerySaannot2` MODIFY `MediaQuery_Saanto2` LONGTEXT;


drop table if exists mediaQuerySaannot3;
CREATE TABLE mediaQuerySaannot3
(
    CSS_File VARCHAR(100),
    CSS_File_ID INT,
    MediaQuery_Saanto TEXT,
    Position INT,
    TextToClearPosition INT,
    LastIndexToClearPosition INT,
    FullMediaQuery TEXT,
    min_width INT,
    max_width INT,
    min_height INT,
    max_height INT
);

ALTER TABLE `mediaQuerySaannot3` MODIFY `FullMediaQuery` LONGTEXT


ALTER TABLE `mediaQuerySaannot` MODIFY `MediaQuery_Saanto` LONGTEXT


ALTER TABLE `cssTiedostot` MODIFY `CSS_Tiedosto` LONGTEXT


INSERT INTO cssTiedostot VALUE ("testi", "joku pitkä tiedosto",10,10,10,10,10,10);
INSERT INTO testaus VALUE ("test 1", "test 2");
INSERT INTO testaus2 VALUE (1, "test 2","asdsad");


drop table if exists cssTiedostot3;
CREATE TABLE cssTiedostot3
(
  CSS_Id int NOT NULL AUTO_INCREMENT,
  nimi VARCHAR(100),
  CSS_Tiedosto TEXT,
  Muokattu_Tiedosto TEXT,
  PRIMARY KEY (CSS_Id)
);
ALTER TABLE `cssTiedostot3` MODIFY `CSS_Tiedosto` LONGTEXT
ALTER TABLE `cssTiedostot2` MODIFY `Muokattu_Tiedosto` LONGTEXT
