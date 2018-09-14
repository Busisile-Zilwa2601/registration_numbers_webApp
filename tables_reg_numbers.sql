Drop TABLE if EXISTS towns, plates;
create table towns( id serial not null primary key,
                    town_name text not null, 
                    town_code text not null
);
create table plates( id serial not null primary key,
                     reg_number text not null, 
                     towns_id int, 
                     foreign key(towns_id) references towns(id) on DELETE CASCADE
);
INSERT INTO towns(town_name, town_code) VALUES('CAPE TOWN', 'CA');
INSERT INTO towns(town_name, town_code) VALUES('BELLVILLE', 'CY');
INSERT INTO towns(town_name, town_code) VALUES('PAARL', 'CJ');
INSERT INTO towns(town_name, town_code) VALUES('STELLENBOSCH', 'CL');