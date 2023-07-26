import requests
import logging
import xml.etree.ElementTree as ET
from datetime import datetime
from datetime import timedelta
import mysql.connector
from mysql.connector import errorcode
from configparser import ConfigParser


def extract(url, key, loc, when):
    logging.info(datetime.utcnow())
    api = f"{url}?serviceKey={key}&LAWD_CD={loc}&DEAL_YMD={when}"
    response = requests.get(api)

    return response.text


def transform(data):
    res = list()
    tree = ET.ElementTree(ET.fromstring(data))
    root = tree.getroot()
    for item in root.findall('.//item'):
        trade_year = item.find('년').text
        trade_month = item.find('월').text
        trade_day = item.find('일').text
        trade_ymd = f"{trade_year}-{trade_month}-{trade_day}"

        ku = item.find('시군구').text
        dong = item.find('법정동').text
        name = item.find('단지').text
        floor = item.find('층').text
        area = item.find('전용면적').text
        built_year = item.find('건축년도').text
        price = item.find('거래금액').text.replace(",", "")

        res.append((trade_ymd, ku, dong, name, int(floor), float(area), int(built_year), int(price)))

    return res


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
                INSERT INTO {dbname}.{table} (trade_ymd, ku, dong, name, floor, area, built_year, price)
                VALUES ('{row[0]}', '{row[1]}', '{row[2]}', '{row[3]}', {row[4]}, {row[5]}, {row[6]}, {row[7]})
            """
            cur.execute(query)
        connection.commit()
        connection.close()



if __name__ == "__main__":
    config = ConfigParser(interpolation=None)
    config.read('config.ini')
    key = config['data_portal']['encoding']
    url = config['data_portal']['url_trade']
    loc = "11110"
    when = "201812"
    start = datetime(2018, 12, 1)
    now = datetime.now()
    dbname = "officetel"
    table = "trade"
    data = extract(url, key, loc, when)
    data = transform(data)
    load(dbname, table, data)
