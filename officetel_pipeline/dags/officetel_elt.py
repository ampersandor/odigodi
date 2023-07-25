"""
SELECT name, area, AVG(deposite) AS average_deposit FROM (   SELECT name, area, deposite, ROW_NUMBER() OVER (PARTITION BY name, area ORDER
BY trade_ymd DESC) AS rn   FROM rent   WHERE dong = '방이동' AND monthly_pay = 0 ) subquery WHERE rn <= 30 GROUP BY name, area;
"""