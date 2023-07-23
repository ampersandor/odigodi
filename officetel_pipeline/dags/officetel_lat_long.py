import logging
import xml.etree.ElementTree as ET
from datetime import datetime
from datetime import timedelta

import requests
import json
import mysql.connector
from mysql.connector import errorcode
from airflow import DAG
from airflow.models import Variable
from airflow.decorators import task
from airflow.operators.python import get_current_context

from plugins import slack

@task
def extract_address(dbname, table, user="airflow", password="airflow", host="localhost", port="3306"):
    try:
        connection = mysql.connector.connect(
            user=user,
            password=password,
            host=host,
            port=port
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
        query = f"""
            SELECT DISTINCT ku, dong, jicode, name FROM {dbname}.{table};
        """
        cur.execute(query)
        res = cur.fetchall()
        connection.close()
    
    return res

@task
def extract_lat_long(rows, url, key, city="서울특별시"):
    data = []
    for ku, dong, jicode, name in rows:
        address = f"{city} {ku} {dong} {jicode}"
        api = f"{url}?query=" + address
        headers = {
            "Authorization": f'KakaoAK {key}',
        }
        try:
            response = requests.get(api, headers=headers)
            response.raise_for_status()
            api_json = json.loads(str(response.text))
            if not api_json["documents"]:
                logging.warning(f"the {api} has no data for {address}, skipping it. \n {api_json}")
                continue
        except requests.exceptions.RequestException as e:
            print(e)
            raise
        else:
            logging.info(api_json)
            address = api_json["documents"][0]["address"]
            lat, long = address['x'], address['y']
            data.append((ku, dong, jicode, name, lat, long))

    return data

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
                ku VARCHAR(30) CHARACTER SET utf8,
                dong VARCHAR(30) CHARACTER SET utf8,
                jicode VARCHAR(30) CHARACTER SET utf8,
                name VARCHAR(30) CHARACTER SET utf8,
                lat FLOAT,
                lng FLOAT
            );
        """
        cur.execute(query)
        for row in data:
            query = f"""
                INSERT INTO {dbname}.{table} (ku, dong, jicode, name, lat, lng)
                VALUES ('{row[0]}', '{row[1]}', '{row[2]}', '{row[3]}', {row[4]}, {row[5]})
            """
            print(query)
            cur.execute(query)

        connection.commit()
        connection.close()


with DAG(
    dag_id = "officetel_lat_long",
    start_date=datetime(2021, 9, 13),
    schedule="0 0 2 * *", # every month (day 2, 00:00)
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
    table = "rent"

    mysql_host = Variable.get("mysql_host")
    url = Variable.get("kakao_map_url")
    key = Variable.get("kakao_map_key")
    
    rows = extract_address(dbname, table, host=mysql_host)
    data = extract_lat_long(rows, url, key)
    load(dbname, "latlong", data, host=mysql_host)


