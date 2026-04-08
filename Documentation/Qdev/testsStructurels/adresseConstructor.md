
## Adresse

### constructor

#### noeuds

ch1 : { ABC }

ch2 : { ABDEF }

ch3 : { ABD ( EGL) 2 EG HI }

#### Arc

ch1, ch2, ch3

ch4 : { ABD EGL E F }

####   
1 - chemins

| 1 if | 2 if | 1 for | chs  | DT                                                                                         | oracle          |
|------|------|-------|------|--------------------------------------------------------------------------------------------|-----------------|
| 1    | 0    | 0     | ch1  | obj{<br />adress : undefined,<br />zipcode : undefined,<br />city : undefined<br />} | AdressException |
| 0    | 1    | 0     | ch2  | obj {<br />test : "bug",<br />zipcode = 44000,<br />city : "Nantes"<br />}                 | AdressException |
| 0    | 0    | 1     | ch3  | obj {<br />adress : "3 rue Joffre",<br />zipcode : 44000,<br />city : "Nantes"<br />}      | Adress()        |
| 0    | 1    | 1     | ch4  | obj : {<br />adress : "3 rue Joffre",<br />batman : "Robin",<br />city : "Gotham"<br />}   | AdressException |
