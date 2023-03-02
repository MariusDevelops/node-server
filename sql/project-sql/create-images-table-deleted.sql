create table images (
  id int4 unsigned primary key auto_increment,
  src varchar(512) not null,
  houseId int4 unsigned not null,
  createdAt timestamp default current_timestamp,
  updatedAt timestamp default current_timestamp on update current_timestamp,
  FOREIGN KEY (houseId) REFERENCES houses(id)
);