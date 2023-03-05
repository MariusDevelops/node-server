create table locations (
  id int4 unsigned primary key auto_increment,
  country varchar(256) not null,
  city varchar(256) not null,
  createdAt timestamp default current_timestamp,
  updatedAt timestamp default current_timestamp on update current_timestamp
);

create table houses (
  id int4 unsigned primary key auto_increment,
  title varchar(256) not null,
  locationId int4 unsigned not null unique,
  price float8 not null,
  rating float4 not null,
  createdAt timestamp default current_timestamp,
  updatedAt timestamp default current_timestamp on update current_timestamp,
  FOREIGN KEY (locationId) REFERENCES locations(id)
);

create table images (
  id int4 unsigned primary key auto_increment,
  src varchar(512) not null,
  houseId int4 unsigned not null,
  createdAt timestamp default current_timestamp,
  updatedAt timestamp default current_timestamp on update current_timestamp,
  FOREIGN KEY (houseId) REFERENCES houses(id)
);
