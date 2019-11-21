drop table if exists kuvat;
CREATE TABLE kuvat
(

  kuva_Nimi VARCHAR(100),
  Base64 TEXT,
  User_id INT(100)

);
ALTER TABLE kuvat MODIFY Base64 LONGTEXT