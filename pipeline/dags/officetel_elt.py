"""
SELECT name, area, AVG(deposite) AS average_deposit FROM (   SELECT name, area, deposite, ROW_NUMBER() OVER (PARTITION BY name, area ORDER
BY trade_ymd DESC) AS rn   FROM rent   WHERE dong = '방이동' AND monthly_pay = 0 ) subquery WHERE rn <= 30 GROUP BY name, area;
"""

import logging
from datetime import datetime

import psycopg2

from airflow import DAG
from airflow.decorators import task
from airflow.hooks.postgres_hook import PostgresHook

from plugins import slack


def get_postgres_connection():
    hook = PostgresHook(postgres_conn_id = 'postgres_docker')
    return hook.get_conn().cursor()

@task
def load(schema, table, query):
    cur = get_postgres_connection()
    try:
        cur.execute("BEGIN;")
        query = f"""DROP TABLE IF EXISTS {schema}.{table}_temp;
                    CREATE TABLE {schema}.{table}_temp AS {query}"""
        logging.info(query)
        cur.execute(query)

        query = f"""SELECT COUNT(1) FROM {schema}.{table}_temp"""
        logging.info(query)
        cur.execute(query)
        count = cur.fetchone()[0]
        if count == 0:
            raise ValueError(f"{table} didn't have any record")
        
        query = f"""DROP TABLE IF EXISTS {schema}.{table};
                ALTER TABLE {schema}.{table}_temp RENAME to {table};"""
        logging.info(query)
        cur.execute(query)
        cur.execute("COMMIT;")
    except (Exception, psycopg2.DatabaseError) as error:
        print(error)
        cur.execute("ROLLBACK;")
        raise 
    logging.info("load done")

with DAG(
    dag_id = "officetel_elt",
    start_date = datetime(2021,9,13),
    schedule = '@once',
    catchup = False,
    max_active_runs=1,
    tags=['ODIGODI', 'prod', 'ELT'],
    default_args={
        "retries": 0,
        "on_failure_callback" : slack.on_failure_callback
    }
) as dag:
    warehouse_schema = "officetel"
    ui_schema = "public"

    table = "trade"
    query = f"""select trade_ymd, name, area, price from {warehouse_schema}.{table} where dong='방이동' order by name, area, trade_ymd;"""
    load(ui_schema, table, query)

    table = "rent"
    query = f"""select trade_ymd, name, area, deposite from {warehouse_schema}.{table} where dong='방이동' and monthly_pay=0 order by name, area, trade_ymd;"""
    load(ui_schema, table, query)

    table = "location"
    query = f"""select name, lat, lng from {warehouse_schema}.{table} where dong='방이동' and lat is not NULL and lng is not NULL;"""
    load(ui_schema, table, query)
