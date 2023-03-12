create table details (
  id int4 unsigned primary key auto_increment,
  material varchar(256) not null,
  sizes varchar(256) not null,
  createdAt timestamp default current_timestamp,
  updatedAt timestamp default current_timestamp on update current_timestamp
);

create table products (
  id int4 unsigned primary key auto_increment,
  title varchar(256) not null,
  detailId int4 unsigned not null unique,
  price float8 not null,
  rating float4 not null,
  createdAt timestamp default current_timestamp,
  updatedAt timestamp default current_timestamp on update current_timestamp,
  FOREIGN KEY (detailId) REFERENCES details(id)
);

create table images (
  id int4 unsigned primary key auto_increment,
  src varchar(512) not null,
  productId int4 unsigned not null,
  createdAt timestamp default current_timestamp,
  updatedAt timestamp default current_timestamp on update current_timestamp,
  FOREIGN KEY (productId) REFERENCES products(id)
);
