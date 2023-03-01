create table locations (
  id int4 unsigned primary key auto_increment,
  country varchar(256) not null,
  city varchar(256) not null,
  createdAt timestamp default current_timestamp,
  updatedAt timestamp default current_timestamp on update current_timestamp
);