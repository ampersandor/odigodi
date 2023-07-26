create user 'airflow'@'%' identified by 'airflow';

create database stock;
grant all privileges on stock.* to 'airflow'@'%';

create database officetel;
grant all privileges on officetel.* to 'airflow'@'%';

flush privileges;