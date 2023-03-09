create table users (
  id int4 unsigned primary key auto_increment,
  name varchar(64) not null,
  surname varchar(64) not null,
  email varchar(64) not null,
  password varchar(64) not null,
  role enum('USER', 'ADMIN') default ('USER'),
  createdAt timestamp default current_timestamp,
  updatedAt timestamp default current_timestamp on update current_timestamp
);