
const btn = document.getElementById("btn");
const resultat = document.getElementById("result");
const container = document.getElementById("container");

// Fait juste une requete GET a l'api 
btn.addEventListener("click", () => {
    fetch("http://localhost:8081/api/v0/utilisation")
        .then(response => response.json())
        .then(data => {
            displayData(data);
        });

   });


function displayData(data) {

    const table = document.createElement("table");

      const headerRow = document.createElement('tr');

      const keys = Object.keys(data[0]);

        keys.forEach(key => {
            const th = document.createElement('th');
            th.textContent = key;
            headerRow.appendChild(th);
        });
        
        table.appendChild(headerRow);
        data.forEach(item => {
            const row = document.createElement('tr');
            keys.forEach(key => {
                const td = document.createElement('td');
                td.textContent = item[key];
                row.appendChild(td);
            });
            table.appendChild(row);
        });

        container.appendChild(table);

}