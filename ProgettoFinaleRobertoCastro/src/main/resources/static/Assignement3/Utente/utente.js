const connectBtn = document.getElementById("connect-btn");
const disconnectBtn = document.getElementById("disconnect-btn");
const rechargeBtn = document.getElementById("recharge-btn");
const statusMsg = document.getElementById("status-msg");
const machineInput = document.getElementById("machine-id");

// 1. URL per leggere i dati (Il file JSON generato dalla tua Repository)
// Il timestamp '?v=...' serve per evitare che il browser usi la vecchia versione in cache
const DATA_URL = "../XML/dati.json?v=" + new Date().getTime();

// 2. URL per scrivere i dati (Il tuo Backend Java/Spring che riceve la richiesta)
// ⚠️ IMPORTANTE: Modifica questo URL con quello del tuo Controller Java
const RECHARGE_API_URL = "http://localhost:8080/api/ricarica";

let currentMachineId = null;

// --- FUNZIONE PER CARICARE I DATI ---
function caricaDati() {
    // Aggiungo timestamp fresco per forzare la rilettura del file appena aggiornato
    const urlFresco = "../XML/dati.json?v=" + new Date().getTime();

    fetch(urlFresco)
        .then(response => {
            if (!response.ok) throw new Error("File JSON non trovato");
            return response.json();
        })
        .then(data => {
            document.getElementById('nome').textContent = data.user_name;
            document.getElementById('credito').textContent = parseFloat(data.credito).toFixed(2);
        })
        .catch(error => {
            console.error("Errore lettura dati:", error);
            // Se fallisce, non mostrare errore rosso all'inizio, magari è il primo avvio
        });
}

// Carica i dati appena si apre la pagina
caricaDati();

// --- GESTIONE CONNESSIONE ---
connectBtn.addEventListener('click', () => {
    let id = machineInput.value.trim();
    if(id){
        currentMachineId = id;
        statusMsg.textContent = "✅ Connesso al distributore " + currentMachineId;
        statusMsg.style.color = "#ffcc80";
        machineInput.disabled = true;
        connectBtn.style.display = "none";
        disconnectBtn.style.display = "block";
    } else {
        alert("Inserisci l'id della macchina");
    }
});

// --- GESTIONE DISCONNESSIONE ---
disconnectBtn.addEventListener('click', () => {
    statusMsg.textContent = "❌ Disconnesso dal distributore " + currentMachineId;
    currentMachineId = null;
    machineInput.value = "";
    machineInput.disabled = false;
    connectBtn.style.display = "block";
    disconnectBtn.style.display = "none";
});

// --- GESTIONE RICARICA (L'unica parte che parla col Server) ---
rechargeBtn.addEventListener('click', () => {
    let importo = prompt("Inserire l'importo da ricaricare (es. 5.00): ");

    if (importo !== null && !isNaN(parseFloat(importo)) && importo.trim() !== "") {
        if (confirm("Confermare per ricaricare l'importo di " + importo + "€?")){

            statusMsg.textContent = "🔄 Elaborazione ricarica in corso...";

            // INVIO RICHIESTA AL SERVER (JAVA)
            fetch(RECHARGE_API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                // Inviamo l'importo al server
                body: JSON.stringify({ importo: parseFloat(importo) })
            })
                .then(response => {
                    if (response.ok) {
                        // SE IL SERVER DICE OK:
                        statusMsg.textContent = "💰 Ricarica effettuata! Aggiorno saldo...";

                        // Aspettiamo un secondo per dare tempo al server di scrivere il file JSON
                        setTimeout(() => {
                            caricaDati(); // Ricarichiamo il file JSON aggiornato
                        }, 500);

                    } else {
                        // SE IL SERVER DICE NO (es. Errore DB):
                        statusMsg.textContent = "⚠️ Errore del server durante la ricarica.";
                        statusMsg.style.color = "red";
                    }
                })
                .catch(error => {
                    console.error("Errore di rete:", error);
                    statusMsg.textContent = "⚠️ Impossibile contattare il server.";
                    statusMsg.style.color = "red";
                });

        } else {
            statusMsg.textContent = "Operazione annullata.";
        }
    } else {
        alert("Inserire un importo numerico valido.");
    }
});