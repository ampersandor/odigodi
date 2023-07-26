import logging
import xml.etree.ElementTree as ET
from datetime import datetime
from datetime import timedelta
import json

import requests
import mysql.connector
from mysql.connector import errorcode

def extract(dbname, table, user="airflow", password="airflow", host="localhost", port="3306"):
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

def get_lat_long(ku, dong, jicode, city="서울특별시"):
    address = f"{city} {ku} {dong} {jicode}"
    url = "https://dapi.kakao.com/v2/local/search/address.json?query=" + address
    headers = {
        "Authorization": f'KakaoAK 01f0c59df4b49e2643b17bd723cb2166',
    }
    api_json = json.loads(str(requests.get(url,headers=headers).text))
    address = api_json["documents"][0]["address"]
    
    return address['x'], address['y']

def extract_lat_long(rows):
    data = []
    for ku, dong, jicode, name in rows:
        lat, long = get_lat_long(ku, dong, jicode)
        data.append((ku, dong, jicode, name, lat, long))

    return data


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



dbname = "officetel"
table = "rent"

rows = extract(dbname, table)

data = extract_lat_long(rows)

load(dbname, "latlong", data)