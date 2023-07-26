import logging
import xml.etree.ElementTree as ET
from datetime import datetime
from datetime import timedelta

import requests
import psycopg2

from airflow import DAG
from airflow.models import Variable
from airflow.decorators import task
from airflow.operators.python import get_current_context
from airflow.hooks.postgres_hook import PostgresHook

from plugins import slack


def _create_table(cur, schema, table, drop_first):
    if drop_first:
        cur.execute(f"DROP TABLE IF EXISTS {schema}.{table};")
    query = f"""
        CREATE TABLE IF NOT EXISTS {schema}.{table} (
            upload_date DATE DEFAULT CURRENT_DATE,
            upload_time TIME DEFAULT CURRENT_TIME,
            trade_ymd DATE,
            ku VARCHAR(30),
            dong VARCHAR(30),
            jicode VARCHAR(30),
            name VARCHAR(30),
            floor INT,
            area FLOAT,
            built_year INT,
            deposite INT,
            monthly_pay INT
        );
    """
    logging.info(query)
    cur.execute(query)


def get_postgres_connection():
    hook = PostgresHook(postgres_conn_id = 'postgres_docker')
    return hook.get_conn().cursor()


@task
def extract(url, key, loc):
    context = get_current_context()
    date = context["execution_date"]
    logging.info(date)
    ym = date.strftime("%Y%m")
    api = f"{url}?serviceKey={key}&LAWD_CD={loc}&DEAL_YMD={ym}"
    try:
        response = requests.get(api)
        response.raise_for_status()
    except requests.exceptions.RequestException as e:  # This is the correct syntax
        logging.warning(f"while requesting to {api}...")
        logging.error("Something went wrong with extract rent data!\n", e)
        raise

    return response.text
    
@task
def transform(data):
    context = get_current_context()
    date = context["execution_date"]
    year, month, day= date.strftime("%Y %m %d").split()
    res = list()
    tree = ET.ElementTree(ET.fromstring(data))
    root = tree.getroot()
    for item in root.findall('.//item'):
        trade_year = item.find('년').text.strip() if item.find('년') is not None else year
        trade_month = item.find('월').text.strip() if item.find('월') is not None else month
        trade_day = item.find('일').text.strip() if item.find('일') is not None else day
        trade_ymd = f"{trade_year}-{trade_month}-{trade_day}"

        ku = item.find('시군구').text.strip() if item.find('시군구') is not None else "NULL"
        dong = item.find('법정동').text.strip() if item.find('법정동') is not None else "NULL"
        jicode = item.find('지번').text.strip() if item.find('지번') is not None else "NULL"
        name = item.find('단지').text.strip() if item.find('단지') is not None else "NULL"
        floor = item.find('층').text.strip() if item.find('층') is not None else "NULL"
        area = item.find('전용면적').text.strip() if item.find('전용면적') is not None else "NULL"
        built_year = item.find('건축년도').text.strip() if item.find('건축년도') is not None else "NULL"
        deposite = item.find('보증금').text.strip().replace(",", "") if item.find('보증금') is not None else "NULL"
        monthly_pay = item.find('월세').text.strip().replace(",", "") if item.find('월세') is not None else "NULL"
        res.append((trade_ymd, ku, dong, jicode, name, floor, area, built_year, deposite, monthly_pay))

    return res

@task
def load(schema, table, data, drop_first=False):
    cur = get_postgres_connection()
    _create_table(cur, schema, table, drop_first)

    try:
        cur.execute("BEGIN;")
        for row in data:
            query = f"""
                INSERT INTO {schema}.{table} (trade_ymd, ku, dong, jicode, name, floor, area, built_year, deposite, monthly_pay)
                VALUES ('{row[0]}', '{row[1]}', '{row[2]}', '{row[3]}', '{row[4]}', {row[5]}, {row[6]}, {row[7]}, {row[8]}, {row[9]})
            """
            logging.info(query)
            cur.execute(query)       
        cur.execute("COMMIT;")
    except (Exception, psycopg2.DatabaseError) as error:
        print(error)
        cur.execute("ROLLBACK;")
        raise 
    logging.info("load done")

with DAG(
    dag_id = "officetel_rent",
    start_date=datetime(2021, 9, 13),
    schedule="0 0 1 * *", # every month (day 1, 00:00)
    max_active_runs=1,
    tags=['ODIGODI', 'officetel', "ETL"],
    catchup=False,
    default_args={
        "retries": 0,
        "retry_delay": timedelta(minutes=3),
        "on_failure_callback" : slack.on_failure_callback
    }
) as dag:
    schema = "officetel"
    table = "rent"
    dong_code = {"방이동": "11710"} # https://www.code.go.kr/stdcode/regCodeL.do
    url = Variable.get("data_portal_url_rent")
    key = Variable.get("data_portal_api_key")
    load(schema, table, transform(extract(url, key, dong_code["방이동"])))
