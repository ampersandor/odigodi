create database odigodi;

create user airflow with encrypted password 'airflow';

grant all privileges on database odigodi to airflow;

\c odigodi airflow
create schema officetel AUTHORIZATION airflow;

create schema prod AUTHORIZATION airflow;