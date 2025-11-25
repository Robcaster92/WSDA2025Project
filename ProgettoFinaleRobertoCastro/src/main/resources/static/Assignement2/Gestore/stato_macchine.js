console.log("start");
const table = document.getElementsByClassName("my-table")
const urlXSD = "../XML/machine_status.xml"
function Macchina(id, modello,posizione, stato){
    this.id = id;
    this.modello = modello;
    this.posizione = posizione
    this.stato = stato;
}
let arrayMacchine = [];

tbody = document.getElementById("body");
fetch(urlXSD)
    .then(res => res.text())
    .then(xmlStr => {
        const xml = new DOMParser().parseFromString(xmlStr, "text/xml");

        const macchine = xml.getElementsByTagName("Distributore");
        let x = 0;
        for (let macchina of macchine) {
            const id = macchina.getElementsByTagName("ID")[0].textContent;
            const modello = macchina.getElementsByTagName("Modello")[0].textContent;
            const posizione = macchina.getElementsByTagName("Posizione")[0].textContent;
            const stato = macchina.getElementsByTagName("Stato")[0].textContent;
            arrayMacchine[x] = new Macchina(id,modello,posizione,stato);
            x+=1;
        }
        refreshList();
    });
function refreshList() {
    tbody.innerHTML = ""; // svuota la tabella

    for (let j = 0; j < arrayMacchine.length; j++) {
        let tr = document.createElement("tr");

        // crea il bottone
        let btn = document.createElement("button");
        btn.textContent = "I/O";
        btn.id = "rimuovi_" + j;

        // evento click per aggiornare lo stato
        btn.addEventListener("click", () => {
            if(arrayMacchine[j].stato == "Online"){
                alert(arrayMacchine[j].id + " Disattivato!");
                arrayMacchine[j].stato = "Offline";
            }else{
                alert(arrayMacchine[j].id + " Attivato!");
                arrayMacchine[j].stato = "Online";
            }
            refreshList();
        })

        if(arrayMacchine[j].stato == "Online") {
            tr.innerHTML = `
            <td>${arrayMacchine[j].id}</td>
            <td>${arrayMacchine[j].modello}</td>
            <td>${arrayMacchine[j].posizione}</td>
            <td>${arrayMacchine[j].stato} 🟢</td>
            `;
        }else{
            tr.innerHTML = `
            <td>${arrayMacchine[j].id}</td>
            <td>${arrayMacchine[j].modello}</td>
            <td>${arrayMacchine[j].posizione}</td>
            <td>${arrayMacchine[j].stato} 🔴</td>
            `;
        }
        let tdBtn = document.createElement("td");
        tdBtn.appendChild(btn);
        tr.appendChild(tdBtn);
        tbody.appendChild(tr);
    }
    const ricercaBtn = document.getElementById("ricercainline")
    ricercaBtn.addEventListener('click', () => {
        let ricercaTxt = document.getElementById("ricercaText").value;
        if(ricercaTxt == ""){
            alert("Impossibile eseguire una ricerca vuota!");
            return;
        }
        console.log(ricercaTxt);
        let output = cerca(arrayMacchine, ricercaTxt);
        console.log(output);
        searchRefresh(output);
    })
    function cerca(lista, valore) {
        valore = valore.toString().toLowerCase();

        return lista.filter(item =>
            item.id.toString().toLowerCase().includes(valore) || item.modello.toLowerCase().includes(valore) || item.posizione.toString().toLowerCase().includes(valore)
        );
    }
    function searchRefresh(output){
        tbody.innerHTML = ""; // svuota la tabella
        for (let j = 0; j < output.length; j++) {
            let tr = document.createElement("tr");
            // crea il bottone
            let btn = document.createElement("button");
            btn.textContent = "I/O";
            btn.id = "rimuovi_" + j;

            // evento click per aggiornare lo stato
            btn.addEventListener("click", () => {
                if(output[j].stato == "Online"){
                    alert(output[j].id + " Disattivato!");
                    output[j].stato = "Offline";
                }else{
                    alert(output[j].id + " Attivato!");
                    output[j].stato = "Online";
                }
                searchRefresh(output);
            })

            if(output[j].stato == "Online") {
                tr.innerHTML = `
            <td>${output[j].id}</td>
            <td>${arrayMacchine[j].modello}</td>
            <td>${arrayMacchine[j].posizione}</td>
            <td>${output[j].stato} 🟢</td>
            `;
            }else{
                tr.innerHTML = `
            <td>${output[j].id}</td>
            <td>${arrayMacchine[j].modello}</td>
            <td>${arrayMacchine[j].posizione}</td>
            <td>${output[j].stato} 🔴</td>
            `;
            }
            let tdBtn = document.createElement("td");
            tdBtn.appendChild(btn);
            tr.appendChild(tdBtn);
            tbody.appendChild(tr);
        }
        const container = document.getElementById("coffemachine");
        // rimuovi il bottone precedente se esiste (eviti duplicati)
        const existing = container.querySelector("#clearFilters");
        if (existing){
            existing.remove();
        }


        const clearBtn = document.createElement("button");
        clearBtn.id = "clearFilters";
        clearBtn.textContent = "Cancella Filtri Di Ricerca";
        clearBtn.addEventListener("click", () => {
            // reindirizza
            window.location.href = "stato_macchine.html";
        });
        document.getElementById("coffemachine").append(clearBtn);
    }
}