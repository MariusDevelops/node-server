alter table users add mobile varchar(64);

set SQL_SAFE_UPDATES = 0;

update users
set mobile = '+yyy xxx xxxxx'
where mobile is null;

alter table users modify mobile varchar(64) not null;

insert into users (email, password, name, surname, mobile) values
('temp@gmail.com', '$2a$05$JmjRa1JS3Dei4MIJ8g1d0eEnXgIQQLKvGMcK.bBCP46L4CGe/K282', 'Temp', 'Temp', '+yyy xxx xxxxx');

SET @temp_user_id = LAST_INSERT_ID();

alter table products 
add ownerId int4 unsigned,
add foreign key (ownerId) references users(id);

update products
set ownerId = @temp_user_id;

alter table products 
modify ownerId int4 unsigned not null;

ALTER TABLE products DROP FOREIGN KEY products_ibfk_1;
DROP INDEX detailId ON products;
ALTER TABLE products ADD FOREIGN KEY (detailId) references details(id);


