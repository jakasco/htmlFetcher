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
  CSS_Tiedosto TEXT
);

ALTER TABLE `cssTiedostot` MODIFY `CSS_Tiedosto` LONGTEXT
INSERT INTO testaus VALUE ("test 1", "test 2");
INSERT INTO testaus2 VALUE (1, "test 2","asdsad");