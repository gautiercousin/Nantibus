
## Station

### constructor

#### noeuds

ch1 : { ABC }

ch2 : { ABDEF }

ch3 : { ABD (EGL)4 EG HIJ }

ch4 : { ABD (EGL)4 EG HK }

#### Arc

ch1, ch2, ch3, ch4

#### 1 - chemins

| 1 if | 2 if | 1 for | 3 if | chs  | DT                                                                                                                                                                                                                                               | oracle                                                                                                  |
|------|------|-------|------|------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|---------------------------------------------------------------------------------------------------------|
| 1    | 0    | 0     | 0    | ch1  | obj{<br />id : undefined<br />}                                                                                                                                                                                                                  | StationException                                                                                        |
| 0    | 1    | 0     | 0    | ch2  | obj {<br />id : 3,<br />name : "Bonjour",<br />status : "Dispo",<br />capacity : 0,<br />availableSpots : 0,<br />position : {},<br />adress : {},<br />test : "Ne passe pas"<br />}                                                             | StationException                                                                                        |
| 0    | 0    | 1     | 0    | ch3  | obj {<br />id : 10,<br />name : "Cholet",<br />status : "Dispo",<br />capacity : 10,<br />availableSpots : 5,<br />adress : {adress : "3 rue de la paix", zipcode : 75001, city : "Paris"},<br />position : {lat : -45, lon : 50}<br />}   | Station(<br />id : 10,<br />name : "Cholet",<br />status : "Dispo",<br />capacity : 10,<br />available) |
| 0    | 0    | 1     | 1    | ch4  | obj : {<br />id : 10,<br />name : "Nael",<br />status : "Indisponible",<br />capacity : 15,<br />availableSpots : 20,<br />adress : {adress : "3 rue de la paix", zipcode : 75001, city : "Paris"},<br />position : {lat : -45 ,lon : 50}<br />} | StationException                                                                                        |

## 