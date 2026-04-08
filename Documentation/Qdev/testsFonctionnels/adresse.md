## Adresse

### Attributs

| Nom de l'attribut | Type                                                              |
|-------------------|-------------------------------------------------------------------|
| obj               | obj                                                               |
| obj.adress        | string                                                            |
| obj.zipcode       | number dans l'intervalle \[ 0 ; 99999 \] avec des valeurs entières|
| obj.city          | string                                                            |

### constructor

#### Cas de test : (DT(obj(adress, zipcode, city), oracle controle l'objet crée avec ses 3 attributs ou levée d'exception `AdresseException`))

#### Intervalles des attributs :

##### obj.adress

|             | type          | intervalle                                                                          |
|-------------|---------------|-------------------------------------------------------------------------------------|
| type        | type : string | A\* où A représente les lettres de l'alphabet français et " " ou epsilon            |
| plage       | type : string | A^0, A+                                                                             |
| fonctionnel | type : string | A^0, A+ où il n'est composé que d'espaces, A+ où il n'est pas composé que d'espaces |

##### obj.zipcode

|             | type           | intervalle                                                                                                                   |
|-------------|----------------|------------------------------------------------------------------------------------------------------------------------------|
| type        | type : number  | \[ -(2^1022) ; (2^1023) \*  (2 - 2^52)\]                                                                                     |
| plage       | type : number  | \[ - (2^1022) ; -(2^53) \[ , \[ - ( 2 ^53) ; 2 ^53 \] ,    ] 2^53;       (2^1023) \*  (2 - 2^52)\]                           |
| fonctionnel | type : number  | \[ -(2^1022); 0\[  , \[0;99999\] avec uniquement les entiers,  \[0 ; 99999\] / entiers, \]99999 ;(2^1023) \* (2 - 2^52) \]   |

##### obj.city

|             | type          | intervalle                                                                          |
|-------------|---------------|-------------------------------------------------------------------------------------|
| type        | type : string | A\* où A représente les lettres de l'alphabet français et " " ou epsilon            |
| plage       | type : string | A^0, A+                                                                             |
| fonctionnel | type : string | A^0, A+ où il n'est composé que d'espaces, A+ où il n'est pas composé que d'espaces |
#### Tables de décision :

| Attributs | Intervalles                                    |   |   |   |   |   |   |   |   |
|-----------|------------------------------------------------|---|---|---|---|---|---|---|---|
|      obj.adress     |      A^0                             | X |   |   |   |   |   |   |   |
|           |      A+ où il n'est composé que d'espaces      |   | X |   |   |   |   |   |   |
|           |      A+ où il n'est pas composé que d'espaces  |   |   | X | X | X | X | X | X |
|      obj.zipcode     |      \[ -(2^1022); 0\[              | I | I | X |   |   |   |   |   |
|           |      \[0;99999\] avec uniquement les entiers   | I | I |   | X | X | X |   |   |
|           |      \[0 ; 99999\] / entiers                   | I | I |   |   |   |   | X |   |
|           |      \]99999 ;(2^1023) \* (2 - 2^52) \]        | I |  I|   |   |   |   |   | X |
|      obj.city     |      A^0                               | I |  I| I | X |   |   | I | I |
|           |      A+ où il n'est composé que d'espaces      | I |  I| I |   | X |   | I | I |
|           |      A+ où il n'est pas composé que d'espaces  | I |  I| I |   |   | X | I | I |
|-----------|------------------------------------------------|---|---|---|---|---|---|---|---|
|Oracle controle|      this.adress                           |   |   |   |   |   | X |   |   |
|           |      this.zipcode                              |   |   |   |   |   | X |   |   |
|           |      this.city d'espaces                       |   |   |   |   |   | X |   |   |
|           |      AdressException                           | X | X | X | X | X |   | X | X |



#### Cas de tests :

| N° Cas de test | Données de test                                                  | Oracle                                                                 |
|----------------|------------------------------------------------------------------|------------------------------------------------------------------------|
|          1     |obj{adress : "", zipcode : 44000, city = "Nantes"}                |   AdressExeption                                                       |
|          2     |obj{adress : " ", zipcode : 44000, city = "Nantes"}               |   AdressExeption                                                       |
|          3     |obj{adress : "3 rue Joffre", zipcode : -1234, city = "Nantes"}    |   AdressExeption                                                       |
|          4     |obj{adress : "3 rue Joffre", zipcode : 44000, city = ""}          |   AdressExeption                                                       |
|          5     |obj{adress : "3 rue Joffre", zipcode : 44000, city = " "}         |   AdressExeption                                                       |
|          6     |obj{adress : "3 rue Joffre", zipcode : 44000, city = "Nantes"}    |   Adress(adress : "3 rue Joffre", zipcode : 1000, city = "Nantes")     |
|          7     |obj{adress : "3 rue Joffre", zipcode : 44000.05, city = "Nantes"} |   AdressExeption                                                       |
|          8     |obj{adress : "3 rue Joffre", zipcode : 500000, city = "Nantes"}   |   AdressExeption                                                       |

