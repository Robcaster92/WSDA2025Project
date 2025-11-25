console.log("start");
const table = document.getElementsByClassName("my-table")
const urlXSD = "../XML/maintainer_status.xml"
function Addetto(id, nome, cognome){
    this.id = id;
    this.nome = nome;
    this.cognome = cognome;
}
let arrayAddetti = [];
const bodyID = document.body.id;

tbody = document.getElementById("body");
fetch(urlXSD)
    .then(res => res.text())
    .then(xmlStr => {
        const xml = new DOMParser().parseFromString(xmlStr, "text/xml");

        const persone = xml.getElementsByTagName("Maintainer");
        const tbody = document.getElementById("body");
        let x = 0;
        for (let persona of persone) {
            const id = persona.getElementsByTagName("ID")[0].textContent;
            const nome = persona.getElementsByTagName("Nome")[0].textContent;
            const cognome = persona.getElementsByTagName("Cognome")[0].textContent;
            arrayAddetti[x] = new Addetto(id,nome,cognome);
            x+=1;
        }
        console.log(x);
        console.log(arrayAddetti);
        refreshList();
    });
function refreshList() {
    const tbody = document.getElementById("body");
    tbody.innerHTML = ""; // svuota la tabella

    for (let j = 0; j < arrayAddetti.length; j++) {
        let tr = document.createElement("tr");

        // crea il bottone
        let btn = document.createElement("button");
        btn.textContent = "-";
        btn.id = "rimuovi_" + j;

        // evento click per rimuovere l'elemento corrispondente
        btn.addEventListener("click", () => {
            alert(arrayAddetti[j].nome + " " + arrayAddetti[j].cognome + " rimosso dalla lista!");
            arrayAddetti.splice(j, 1);
            refreshList();
        })

        tr.innerHTML = `
            <td>${arrayAddetti[j].id}</td>
            <td>${arrayAddetti[j].nome}</td>
            <td>${arrayAddetti[j].cognome}</td>
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
    const ID_addetto = document.getElementById("id-addetto").value;
    const name_addetto = document.getElementById("nome-addetto").value;
    const surname_addetto = document.getElementById("cognome-addetto").value;
    console.log(ID_addetto);
    for(let x = 0; x < arrayAddetti.length; x++){
        if(arrayAddetti[x].id === ID_addetto){
            trovato = true;
            console.log("trovato");
        }
    }
    if(trovato){
        alert("ID gia presente nel sistema!")
    }else{
        arrayAddetti.push(new Addetto(ID_addetto,name_addetto,surname_addetto));
        console.log(arrayAddetti.length);
        refreshList();
        alert(arrayAddetti[-1].nome + " " + arrayAddetti[-1].cognome + " aggiunto in lista!");
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