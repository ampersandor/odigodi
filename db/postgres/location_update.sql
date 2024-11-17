INSERT INTO officetel_location (created_at, city, sggnm, umdnm, jibun, offinm, lat, lng)
SELECT 
    NOW(),  -- created_at은 현재 시간으로 설정
    t.city,
    t.sggnm,
    t.umdnm,
    t.jibun,
    t.offinm,
    NULL,  -- lat, lng은 여기서 제공하지 않거나 필요 시 업데이트할 수 있습니다.
    NULL
FROM 
    rent t
ON CONFLICT (city, sggnm, umdnm, jibun, offinm) DO NOTHING;


INSERT INTO officetel_location (created_at, city, sggnm, umdnm, jibun, offinm, lat, lng)
SELECT 
    NOW(),  -- created_at은 현재 시간으로 설정
    t.city,
    t.ku,
    t.dong,
    t.jicode,
    t.name,
    NULL,  -- lat, lng은 여기서 제공하지 않거나 필요 시 업데이트할 수 있습니다.
    NULL
FROM 
    trade t
ON CONFLICT (city, sggnm, umdnm, jibun, offinm) DO NOTHING



