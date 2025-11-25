console.log("start");
const table = document.getElementsByClassName("my-table")
const urlXSD = "../XML/machine_status.xml"
function Macchina(id, modello, stato){
    this.id = id;
    this.modello = modello;
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
            const stato = macchina.getElementsByTagName("Stato")[0].textContent;
            arrayMacchine[x] = new Macchina(id,modello,stato);
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
        btn.textContent = "-";
        btn.id = "rimuovi_" + j;

        // evento click per rimuovere l'elemento corrispondente
        btn.addEventListener("click", () => {
            alert(arrayMacchine[j].modello + " " + arrayMacchine[j].id + " rimosso dalla lista!");
            arrayMacchine.splice(j, 1);
            refreshList();
        })

        tr.innerHTML = `
            <td>${arrayMacchine[j].id}</td>
            <td>${arrayMacchine[j].modello}</td>
            <td>${arrayMacchine[j].stato}</td>
        `;

        let tdBtn = document.createElement("td");
        tdBtn.appendChild(btn);
        tr.appendChild(tdBtn);

        tbody.appendChild(tr);
    }
}

const aggiungi = document.getElementById("aggiungi");
let trovato = false;
aggiungi.addEventListener('click', () => {
    const ID_macchina = document.getElementById("id-macchina").value;
    const modello_macchina = document.getElementById("modelloa-macchina").value;
    const stato_macchina = document.getElementById("stato-macchina").value;
    for(let x = 0; x < arrayMacchine.length; x++){
        if(arrayMacchine[x].id === ID_macchina){
            trovato = true;
            console.log("trovato");
        }
    }
    if(trovato){
        alert("ID gia presente nel sistema!")
    }else{
        arrayMacchine.push(new Macchina(ID_macchina, modello_macchina, stato_macchina));
        console.log(arrayMacchine.length);
        refreshList();
        alert(arrayMacchine[-1].modello + " " + arrayMacchine[-1].id + " aggiunto in lista!");
    }
})

const tabOpener = document.getElementById("apri_aggiungi_tab");
tabOpener.addEventListener('click', () => {
    document.getElementById("tab_aggiungi").style.display = "block";
    tabOpener.style.display = "none";
})
const tabCloser = document.getElementById("annulla");
tabCloser.addEventListener('click', () => {
    document.getElementById("tab_aggiungi").style.display = "none";
    tabOpener.style.display = "block";
})