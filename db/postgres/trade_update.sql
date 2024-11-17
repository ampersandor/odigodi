INSERT INTO officetel_trade (
    created_at, trade_ymd, city, sggnm, umdnm, jibun, offinm, floor, excluusear, buildyear, dealamount, location_id
)
SELECT 
    NOW(),
    t.trade_ymd,
    t.city,
    t.sggnm,
    t.umdnm,
    t.jibun,
    t.offinm,
    t.floor,
    t.excluusear,
    t.buildyear,
    t.dealamount,
    l.id AS location_id
FROM 
    trade t
JOIN 
    officetel_location l ON 
        t.city = l.city AND
        t.sggnm = l.sggnm AND
        t.umdnm = l.umdnm AND
        t.jibun = l.jibun AND
        t.offinm = l.offinm
WHERE 
    NOT EXISTS (
        SELECT 1 
        FROM officetel_trade ot
        WHERE 
            ot.trade_ymd = t.trade_ymd AND
            ot.city = t.city AND
            ot.sggnm = t.sggnm AND
            ot.umdnm = t.umdnm AND
            ot.jibun = t.jibun AND
            ot.offinm = t.offinm AND
            ot.floor = t.floor AND
            ot.excluusear = t.excluusear AND
            ot.dealamount = t.dealamount
    );