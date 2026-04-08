
## Station

### constructor

#### Cas de test : (DT(obj(id, name, status, adress, capacity, availableSpots, position), oracle controle l'objet crée Station avec ses 7 attributs ou levée d'exception `StationException`))

#### Intervalles des attributs :

##### obj.id

|             | type          | intervalle                                                                                  |
|-------------|---------------|---------------------------------------------------------------------------------------------|
| type        | type :  number| \[ -(2^1022) ; (2^1023) \*  (2 - 2^52)\]                                                    |
| plage       | type :  number| \[ -(2^1022); - ( 2 ^53)\[  , \[ - ( 2 ^53) ; 2 ^53 \], \]2 ^53 ;(2^1023) \* (2 - 2^52) \]  |
| fonctionnel | type :  number|  \[ -(2^1022); ( 2 ^53)\[  , \[ - ( 2 ^53) ; 2 ^53 \] avec uniquement les entiers,   \[ - ( 2 ^53) ; 2 ^53 \] / entiers, \]2 ^53 ;(2^1023) \* (2 - 2^52) \]                                                                                              |

##### obj.name

|             | type          | intervalle                                                                          |
|-------------|---------------|-------------------------------------------------------------------------------------|
| type        | type : string | A\* où A représente les lettres de l'alphabet français et " " ou epsilon            |
| plage       | type : string | A^0, A+                                                                             |
| fonctionnel | type : string | A^0, A+ où il n'est composé que d'espaces, A+ où il n'est pas composé que d'espaces |

##### obj.status

|             | type          | intervalle                                                                          |
|-------------|---------------|-------------------------------------------------------------------------------------|
| type        | type : string | A\* où A représente les lettres de l'alphabet français et " " ou epsilon            |
| plage       | type : string | A^0, A+                                                                             |
| fonctionnel | type : string | A^0, A+ où il n'est composé que d'espaces, A+ où il n'est pas composé que d'espaces |

##### obj.capacity

|             | type          | intervalle                                                                                  |
|-------------|---------------|---------------------------------------------------------------------------------------------|
| type        | type :  number| \[ -(2^1022) ; (2^1023) \*  (2 - 2^52)\]                                                    |
| plage       | type :  number| \[ -(2^1022); - ( 2 ^53)\[  , \[ - ( 2 ^53) ; 2 ^53 \], \]2 ^53 ;(2^1023) \* (2 - 2^52) \]  |
| fonctionnel | type :  number|  \[ -(2^1022);; 0\[,   \[0; 2 ^53 \], \]2 ^53 ;(2^1023) \* (2 - 2^52) \]                    |

##### obj.availableSpots

|             | type          | intervalle                                                                                      |
|-------------|---------------|-------------------------------------------------------------------------------------------------|
| type        | type :  number| \[ -(2^1022) ; (2^1023) \*  (2 - 2^52)\]                                                        |
| plage       | type :  number| \[ -(2^1022); - ( 2 ^53)\[  , \[ - ( 2 ^53) ; 2 ^53 \], \]2 ^53 ;(2^1023) \* (2 - 2^52) \]      |
| fonctionnel | type :  number|  \[ -(2^1022);; 0\[,   \[0; capacity\],\[capacity; 2 ^53 \], \]2 ^53 ;(2^1023) \* (2 - 2^52) \] |


#### Tables de décision :

| Attributs         | Intervalles                                         |   |   |   |   |   |   |   |   |   |   |   |   |   |
|-------------------|-----------------------------------------------------|---|---|---|---|---|---|---|---|---|---|---|---|---|
|obj.id             |\[ -(2^1022); -( 2 ^53)\[                            | X |   |   |   |   |   |   |   |   |   |   |   |   |
|                   |\[ - ( 2 ^53) ; 2 ^53 \] avec uniquement les entiers |   |   |   | X | X | X | X | X | X | X | X | X | X |
|                   |\[ - ( 2 ^53) ; 2 ^53 \] / entiers                   |   | X |   |   |   |   |   |   |   |   |   |   |   |
|                   |\]2 ^53 ;(2^1023) \* (2 - 2^52) \]                   |   |   | X |   |   |   |   |   |   |   |   |   |   |
|obj.name           |A^0                                                  | I | I | I | X |   |   |   |   |   |   |   |   |   |
|                   |A+ où il n'est composé que d'espaces                 | I | I | I |   | X |   |   |   |   |   |   |   |   |
|                   |A+ où il n'est pas composé que d'espaces             | I | I | I |   |   | X | X | X | X | X | X | X | X |
|obj.status         |A^0                                                  | I | I | I | I | I | X |   |   |   |   |   |   |   |
|                   |A+ où il n'est composé que d'espaces                 | I | I | I | I | I |   | X |   |   |   |   |   |   |
|                   |A+ où il n'est pas composé que d'espaces             | I | I | I | I | I |   |   | X | X | X | X | X | X |
|obj.capacity       |\[ -(2^1022); 0\[                                    | I | I | I | I | I | I | I | X |   |   |   |   |   |
|                   |\[0; 2 ^53 \]                                        | I | I | I | I | I | I | I |   |   | X | X | X | X |
|                   |\]2 ^53 ;(2^1023) \* (2 - 2^52) \]                   | I | I | I | I | I | I | I |   | X |   |   |   |   |
|obj.availableSpots |\[ -(2^1022);  0\[                                   | I | I | I | I | I | I | I | I | I | X |   |   |   |
|                   |\[0; capacity\]                                      | I | I | I | I | I | I | I | I | I |   |   |   | X |
|                   |\[capacity; 2 ^53 \]                                 | I | I | I | I | I | I | I | I | I |   | X |   |   |
|                   |\]2 ^53 ;(2^1023) \* (2 - 2^52) \]                   | I | I | I | I | I | I | I | I | I |   |   | X |   |
|-------------------|-----------------------------------------------------|---|---|---|---|---|---|---|---|---|---|---|---|---|
|Oracle controle    |this.id                                              |   |   |   |   |   |   |   |   |   |   |   |   | X |
|                   |this.name                                            |   |   |   |   |   |   |   |   |   |   |   |   | X |
|                   |this.status                                          |   |   |   |   |   |   |   |   |   |   |   |   | X |
|                   |this.capacity                                        |   |   |   |   |   |   |   |   |   |   |   |   | X |
|                   |this.availableSpots                                  |   |   |   |   |   |   |   |   |   |   |   |   | X |
|                   |StationException                                     | X | X | X | X | X | X | X | X | X | X | X | X |   |



#### Cas de tests :

| N° Cas de test | Données de test                                                                                     | Oracle                   |
|----------------|-----------------------------------------------------------------------------------------------------|--------------------------|
|      1         |obj{id : -( 2 ^53), name : "name",      status : "status", capacity : 100,   availableSpots : 50}    |    PositionException     |
|      2         |obj{id : 0.4,       name : "name",      status : "status", capacity : 100,   availableSpots : 50}    |    PositionException     |
|      3         |obj{id : 2 ^54 ,    name : "name",      status : "status", capacity : 100,   availableSpots : 50}    |    PositionException     |
|      4         |obj{id : 42,        name : "",          status : "status", capacity : 100,   availableSpots : 50}    |    PositionException     |
|      5         |obj{id : 42,        name : " ",         status : "status", capacity : 100,   availableSpots : 50}    |    PositionException     |
|      6         |obj{id : 42,        name : "Station X", status : "",       capacity : 100,   availableSpots : 50}    |    PositionException     |
|      7         |obj{id : 42,        name : "Station X", status : " ",      capacity : 100,   availableSpots : 50}    |    PositionException     |
|      8         |obj{id : 42,        name : "Station X", status : "Dispo",  capacity : -1,    availableSpots : 50}    |    PositionException     |
|      9         |obj{id : 42,        name : "Station X", status : "Dispo",  capacity : 2 ^54, availableSpots : 50}    |    PositionException     |
|      10        |obj{id : 42,        name : "Station X", status : "Dispo",  capacity : 248,   availableSpots : -8}    |    PositionException     |
|      11        |obj{id : 42,        name : "Station X", status : "Dispo",  capacity : 248,   availableSpots : 300}   |    PositionException     |
|      12        |obj{id : 42,        name : "Station X", status : "Dispo",  capacity : 248,   availableSpots : 2 ^54} |    PositionException     |
|      13        |obj{id : 42,        name : "Station X", status : "Dispo",  capacity : 248,   availableSpots : 47}    |    Station{id : 42,name:"Station X",status:"Dispo",capacity:248,availableSpots:47}|