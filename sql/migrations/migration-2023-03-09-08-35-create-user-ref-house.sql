alter table users add mobile varchar(64);

set SQL_SAFE_UPDATES = 0;

update users
set mobile = '+yyy xxx xxxxx'
where mobile is null;

alter table users modify mobile varchar(64) not null;

insert into users (email, password, name, surname, mobile) values
('temp@gmail.com', '$2b$05$XpAbe6hvlL9ObmADeO1Dd.089uztgQvUEy4kJMqobxJLnp61.9pPK', 'Temp', 'Temp', '+yyy xxx xxxxx');

SET @temp_user_id = LAST_INSERT_ID();

alter table houses 
add ownerId int4 unsigned,
add foreign key (ownerId) references users(id);

update houses
set ownerId = @temp_user_id;

alter table houses 
modify ownerId int4 unsigned not null;

ALTER TABLE houses DROP FOREIGN KEY houses_ibfk_1;
DROP INDEX locationId ON houses;
ALTER TABLE houses ADD FOREIGN KEY (locationId) references locations(id);


