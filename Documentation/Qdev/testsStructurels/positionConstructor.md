
## Position

### constructor

#### noeuds

ch1 : { ABC }

ch2 : { ABD EGL EG HJK }

ch3 : { ABDEF }

#### Arc

ch1, ch2, ch3

ch4 : { ABD EGL EG HI }

####   
1 - chemins

| 1 if | 2 if | 1 for | 3 if | chs  | DT                                               | oracle            |
|------|------|-------|------|------|--------------------------------------------------|-------------------|
| 1    | 0    | 0     | 0    | ch1  | obj{<br />lat : undefined,<br />lon : 10,<br />} | PositionException |
| 0    | 1    | 0     | 0    | ch2  | obj {<br />lat : 0,<br />lon = 0,<br />}         | Postion()         |
| 0    | 0    | 1     | 0    | ch3  | obj {<br />lat : "bug",<br />}                   | PositionException |
| 0    | 0    | 1     | 1    | ch4  | obj : {<br />lat : 100,<br />lon : 180,<br />}   | PositionException |
