// URL che punta al tuo nuovo GestoreController
const API_URL = "http://localhost:8081/api/gestore/distributori";
const tbody = document.getElementById("body");

// --- 1. CARICAMENTO DATI DAL SERVER ---
function refreshList() {
    fetch(API_URL)
        .then(res => res.json()) // Leggiamo JSON, non più XML!
        .then(data => {
            tbody.innerHTML = "";
            // Il server ci restituisce un array di macchine
            data.forEach(macchina => {
                let tr = document.createElement("tr");

                // Bottone Rimuovi
                let btn = document.createElement("button");
                btn.textContent = "-";
                btn.onclick = () => rimuovi(macchina.id);

                tr.innerHTML = `
                    <td>${macchina.id}</td>
                    <td>${macchina.modello}</td>
                    <td>${macchina.stato}</td>
                `;

                let tdBtn = document.createElement("td");
                tdBtn.appendChild(btn);
                tr.appendChild(tdBtn);
                tbody.appendChild(tr);
            });
        })
        .catch(err => console.error("Errore caricamento:", err));
}

// --- 2. RIMOZIONE ---
function rimuovi(id) {
    if(confirm("Vuoi davvero rimuovere il distributore " + id + "?")) {
        fetch(API_URL + "/" + id, { method: 'DELETE' })
            .then(() => {
                alert("Distributore rimosso!");
                refreshList();
            });
    }
}

// --- 3. AGGIUNTA ---
const aggiungi = document.getElementById("aggiungi");
aggiungi.addEventListener('click', () => {
    const nuovaMacchina = {
        id: document.getElementById("id-macchina").value,
        modello: document.getElementById("modelloa-macchina").value,
        stato: document.getElementById("stato-macchina").value
    };

    fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(nuovaMacchina)
    })
        .then(res => {
            if(res.ok) {
                alert("Macchina aggiunta con successo!");
                refreshList();
                // Chiudi il form
                document.getElementById("tab_aggiungi").style.display = "none";
                document.getElementById("apri_aggiungi_tab").style.display = "block";
            } else {
                alert("Errore: ID duplicato o dati non validi.");
            }
        });
});

// Gestione UI (Apertura/Chiusura Tab)
const tabOpener = document.getElementById("apri_aggiungi_tab");
tabOpener.addEventListener('click', () => {
    document.getElementById("tab_aggiungi").style.display = "block";
    tabOpener.style.display = "none";
});

const tabCloser = document.getElementById("annulla");
tabCloser.addEventListener('click', () => {
    document.getElementById("tab_aggiungi").style.display = "none";
    tabOpener.style.display = "block";
});

// Avvia il caricamento iniziale
refreshList();