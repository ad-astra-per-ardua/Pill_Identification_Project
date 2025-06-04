CREATE TABLE drugs (
  id SERIAL PRIMARY KEY,
  name TEXT,
  ingredient TEXT,
  function TEXT,
  dosage TEXT,
  side_effects TEXT,
  manufacturer TEXT
);

INSERT INTO drugs (name, ingredient, function, dosage, side_effects, manufacturer)
VALUES
('아스피린', '아세틸살리실산', '진통, 해열, 항염', '하루 2~3회, 1정씩', '위장 장애, 출혈', '한국B제약'),
('타이레놀', '아세트아미노펜', '진통, 해열', '6시간 간격으로 1~2정', '간 손상 가능성', 'J사');
