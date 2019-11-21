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

drop table if exists cssTiedostot2;
CREATE TABLE cssTiedostot2
(
  nimi VARCHAR(100),
  CSS_Tiedosto TEXT
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

ALTER TABLE `mediaQuerySaannot` MODIFY `MediaQuery_Saanto` LONGTEXT


ALTER TABLE `cssTiedostot` MODIFY `CSS_Tiedosto` LONGTEXT


INSERT INTO cssTiedostot VALUE ("testi", "joku pitkä tiedosto",10,10,10,10,10,10);
INSERT INTO testaus VALUE ("test 1", "test 2");
INSERT INTO testaus2 VALUE (1, "test 2","asdsad");