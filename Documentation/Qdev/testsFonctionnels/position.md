
## Position

### constructor

#### Cas de test : (DT(obj(longitude, latitude), oracle controle l'objet crée Position avec ses 2 attributs ou levée d'exception `PositionException`))

#### Intervalles des attributs :

##### obj.longitude

|             | type          | intervalle                                                                 |
|-------------|---------------|----------------------------------------------------------------------------|
| type        | type :  number| \[ -(2^1022) ; (2^1023) \*  (2 - 2^52)\]                                   |
| plage       | type :  number| \[ -(2^1022) ; -180 \[ , \[-180 ; 180\] , \]180; (2^1023) \*  (2 - 2^52)\] |
| fonctionnel | type :  number| \[ -(2^1022) ; -180 \[ , \[-180 ; 180\] , \]180; (2^1023) \*  (2 - 2^52)\] |

##### obj.latitude

|             | type          | intervalle                                                             |
|-------------|---------------|------------------------------------------------------------------------|
| type        | type :  number| \[ -(2^1022) ; (2^1023) \*  (2 - 2^52)\]                               |
| plage       | type :  number| \[ -(2^1022) ; -90 \[ , \[-90 ; 90\] , \]90; (2^1023) \*  (2 - 2^52)\] |
| fonctionnel | type :  number| \[ -(2^1022) ; -90 \[ , \[-90 ; 90\] , \]90; (2^1023) \*  (2 - 2^52)\] |

#### Tables de décision :

| Attributs     | Intervalles                    |   |   |   |   |   |
|---------------|--------------------------------|---|---|---|---|---|
|obj.longitude  |\[ -(2^1022) ; -180 \[          |X  |   |   |   |   |
|               |\[-180 ; 180\]                  |   | X | X | X |   |
|               |\]180; (2^1023) \*  (2 - 2^52)\]|   |   |   |   | X |
|obj.latitude   |\[ -(2^1022) ; -90 \[           | I | X |   |   | I |
|               |\[-90 ; 90\]                    | I |   | X |   | I |
|               |\]90; (2^1023) \*  (2 - 2^52)\] | I |   |   | X | I |
|---------------|--------------------------------|---|---|---|---|---|
|Oracle controle|this.longitude                  |   |   | X |   |   |
|               |this.latitude                   |   |   | X |   |   |
|               |PositionException               | X | X |   | X | X |



#### Cas de tests :

| N° Cas de test | Données de test                     | Oracle                   |
|----------------|-------------------------------------|--------------------------|
|      1         | obj{longitude : -181, latitude : 0} |    PositionException     |
|      2         | obj{longitude : 0, latitude : -91}  |    PositionException     |
|      3         | obj{longitude : 0, latitude : 5}    |Position(lon : 0, lat : 5)|
|      4         | obj{longitude : 0, latitude : 91}   |    PositionException     |
|      5         | obj{longitude : 181, latitude : 0}  |    PositionException     |
