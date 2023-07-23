import logging
import xml.etree.ElementTree as ET
from datetime import datetime
from datetime import timedelta

import requests
import mysql.connector
from mysql.connector import errorcode
from airflow import DAG
from airflow.models import Variable
from airflow.decorators import task
from airflow.operators.python import get_current_context

from plugins import slack

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
        print(e)
        raise SystemExit(e)
    else:
        print(api)
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
        price = item.find('거래금액').text.strip().replace(",", "") if item.find('거래금액') is not None else "NULL"

        res.append((trade_ymd, ku, dong, jicode, name, floor, area, built_year, price))

    return res

@task
def load(dbname, table, data, user="airflow", password="airflow", host="localhost", port="3306", drop_first=False):
    try:
        connection = mysql.connector.connect(
            user=user,
            password=password,
            host=host,
            port=port,
        )
    except mysql.connector.Error as err:
        if err.errno == errorcode.ER_ACCESS_DENIED_ERROR:
            print("Something is wrong with your user name or password")
        elif err.errno == errorcode.ER_BAD_DB_ERROR:
            print("Database does not exist")
        else:
            print(err)
        raise
    else:
        cur = connection.cursor()
        if drop_first:
            cur.execute(f"DROP TABLE IF EXISTS {dbname}.{table};")
        query = f"""
            CREATE TABLE IF NOT EXISTS {dbname}.{table} (
                upload_date DATE DEFAULT CURRENT_DATE,
                upload_time TIME DEFAULT CURRENT_TIME,
                trade_ymd DATE,
                ku VARCHAR(30) CHARACTER SET utf8,
                dong VARCHAR(30) CHARACTER SET utf8,
                jicode VARCHAR(30) CHARACTER SET utf8,
                name VARCHAR(30) CHARACTER SET utf8,
                floor INT,
                area FLOAT,
                built_year INT,
                price INT
            );
        """
        cur.execute(query)
        for row in data:
            query = f"""
                INSERT INTO {dbname}.{table} (trade_ymd, ku, dong, jicode, name, floor, area, built_year, price)
                VALUES ('{row[0]}', '{row[1]}', '{row[2]}', '{row[3]}', '{row[4]}', {row[5]}, {row[6]}, {row[7]}, {row[8]})
            """
            cur.execute(query)
        connection.commit()
        connection.close()


with DAG(
    dag_id = "officetel_trade",
    start_date=datetime(2021, 9, 13),
    schedule="0 0 1 * *", # every month (day 1, 00:00)
    max_active_runs=1,
    tags=['ODIGODI', 'Officetel'],
    catchup=True,
    default_args={
        "retries": 1,
        "retry_delay": timedelta(minutes=3),
        "on_failure_callback" : slack.on_failure_callback
    }
) as dag:
    dbname = "officetel"
    table = "trade"
    mysql_host = Variable.get("mysql_host")
    url = Variable.get("data_portal_url_trade")
    key = Variable.get("data_portal_api_key")
    dong_code = {"방이동": "11710"} # https://www.code.go.kr/stdcode/regCodeL.do
    load(dbname, table, transform(extract(url, key, dong_code["방이동"])), host=mysql_host)
