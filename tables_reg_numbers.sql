create table towns( id serial not null primary key,
                    town_name text not null, 
                    town_code text not null
);
create table plates( id serial not null primary key,
                     reg_number text not null, 
                     towns_id int, 
                     foreign key(towns_id) references towns(id)
);
