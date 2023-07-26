# -*- coding: utf-8 -*-
from airflow.hooks.postgres_hook import PostgresHook
from airflow.models import Variable
from oauth2client.service_account import ServiceAccountCredentials

import base64
import gspread
import json
import logging
import os
import pandas as pd
import pytz
import requests


def write_variable_to_local_file(variable_name, local_file_path):
    content = Variable.get(variable_name)
    f = open(local_file_path, "w")
    f.write(content)
    f.close()


def get_gsheet_client():
    data_dir = Variable.get("DATA_DIR")
    scope = ['https://spreadsheets.google.com/feeds', 'https://www.googleapis.com/auth/drive']
    gs_json_file_path = data_dir + 'google-sheet.json'

    write_variable_to_local_file('google_sheet_access_token', gs_json_file_path)
    credentials = ServiceAccountCredentials.from_json_keyfile_name(gs_json_file_path, scope)
    gc = gspread.authorize(credentials)

    return gc


def p2f(x):
    return float(x.strip('%'))/100


def get_google_sheet_to_csv(
    sheet_uri,
    tab,
    filename,
    header_line=1,
    remove_dollar_comma=0,
    rate_to_float=0):
    """
    Download data in a tab (indicated by "tab") in a spreadsheet ("sheet_uri") as a csv ("filename")
    - if tab is None, then the records in the first tab of the sheet will be downloaded
    - if tab has only one row in the header, then just use the default value which is 1
    - setting remove_dollar_comma to 1 will remove any dollar signs or commas from the values in the CSV file
      - dollar sign might need to be won sign instead here
    - setting rate_to_float to 1 will convert any percentage numeric values to fractional values (50% -> 0.5)
    """

    data, header = get_google_sheet_to_lists(
        sheet_uri,
        tab,
        header_line,
        remove_dollar_comma=remove_dollar_comma)

    if rate_to_float:
        for row in data:
            for i in range(len(row)):
                if str(row[i]).endswith("%"):
                    row[i] = p2f(row[i])

    data = pd.DataFrame(data, columns=header).to_csv(
        filename,
        index=False,
        header=True,
        encoding='utf-8'
    )


def get_google_sheet_to_lists(sheet_uri, tab=None, header_line=1, remove_dollar_comma=0):
    gc = get_gsheet_client()

    # no tab is given, then take the first sheet
    # here tab is the title of a sheet of interest
    if tab is None:
        wks = gc.open_by_url(sheet_uri).sheet1
    else:
        wks = gc.open_by_url(sheet_uri).worksheet(tab)

    # list of lists, first value of each list is column header
    print(wks.get_all_values())
    print(int(header_line)-1)
    data = wks.get_all_values()[header_line-1:]

    # header = wks.get_all_values()[0]
    header = data[0]
    if remove_dollar_comma:
        data = [replace_dollar_comma(l) for l in data if l != header]
    else:
        data = [l for l in data if l != header]
    return data, header


def add_df_to_sheet_in_bulk(sh, sheet, df, header=None, clear=False):
    records = []
    headers = list(df.columns)
    records.append(headers)

    for _, row in df.iterrows():
        record = []
        for column in headers:
            if str(df.dtypes[column]) in ('object', 'datetime64[ns]'):
                record.append(str(row[column]))
            else:
                record.append(row[column])
        records.append(record)

    if clear:
        sh.worksheet(sheet).clear()
    sh.values_update(
        '{sheet}!A1'.format(sheet=sheet),
        params={'valueInputOption': 'RAW'},
        body={'values': records}
    )


def update_sheet(filename, sheetname, sql, conn_id):
    client = get_gsheet_client()
    hook = PostgresHook(postgres_conn_id=conn_id)
    sh = client.open(filename)
    df = hook.get_pandas_df(sql)
    print(sh.worksheets())
    sh.worksheet(sheetname).clear()
    add_df_to_sheet_in_bulk(sh, sheetname, df.fillna(''))


def replace_dollar_comma(lll):
    return [ ll.replace(',', '').replace('$', '') for ll in lll ]


def get_location(address):
    url = "https://dapi.kakao.com/v2/local/search/address.json?query=" + address
    headers = {
        "Authorization": "KakaoAK 01f0c59df4b49e2643b17bd723cb2166",
    }
    api_json = json.loads(str(requests.get(url,headers=headers).text))
    return api_json


address = "서울특별시 송파구 가락동 98"
# address = "서울특별시 종로구 종로1길 36, 대림빌딩 (수송동)"
print(get_location(address))