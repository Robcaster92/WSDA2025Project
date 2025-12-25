// --- 1. RIFERIMENTI HTML ---
const connectBtn = document.getElementById("connect-btn");
const disconnectBtn = document.getElementById("disconnect-btn");
const rechargeBtn = document.getElementById("recharge-btn");
const statusMsg = document.getElementById("status-msg");
const machineInput = document.getElementById("machine-id");
const welcomeLabel = document.getElementById("nome");
const creditLabel = document.getElementById("credito");

let currentMachineId = null;

// --- 2. CONTROLLO LOGIN ---
// Recuperiamo chi è l'utente loggato davvero
const loggedUser = localStorage.getItem("username_loggato");

// Se non c'è nessuno, via al login!
if (!loggedUser) {
    alert("Devi effettuare il login!");
    window.location.href = "../login.html";
}

// URL API
const USER_INFO_URL = "http://localhost:8081/api/utente/info?username=" + loggedUser;
const RECHARGE_API_URL = "http://localhost:8081/api/ricarica";

// --- 3. CARICAMENTO DATI UTENTE ---
function caricaDati() {
    fetch(USER_INFO_URL)
        .then(response => {
            if (!response.ok) throw new Error("Utente non trovato o errore server");
            return response.json();
        })
        .then(data => {
            // Aggiorna l'HTML con i dati dal DB
            if(welcomeLabel) welcomeLabel.textContent = "Ciao, " + (data.user_name || "Utente");
            if(creditLabel) creditLabel.textContent = (data.credito || 0).toFixed(2);
        })
        .catch(error => {
            console.error("Errore:", error);
            if(statusMsg) statusMsg.textContent = "⚠️ Errore dati: " + error.message;
        });
}

// Avvia subito il caricamento
caricaDati();

// --- 4. GESTIONE CONNESSIONE MACCHINA ---
if(connectBtn){
    connectBtn.addEventListener('click', () => {
        let id = machineInput.value.trim();
        if(id){
            currentMachineId = id;
            statusMsg.textContent = "✅ Connesso al distributore " + currentMachineId;
            statusMsg.style.color = "#ffcc80";

            // UI Update
            machineInput.disabled = true;
            connectBtn.style.display = "none";
            disconnectBtn.style.display = "block";
        } else {
            alert("Inserisci l'id della macchina");
        }
    });
}

// --- 5. GESTIONE DISCONNESSIONE ---
if(disconnectBtn){
    disconnectBtn.addEventListener('click', () => {
        statusMsg.textContent = "❌ Disconnesso";
        currentMachineId = null;

        // UI Update
        machineInput.value = "";
        machineInput.disabled = false;
        connectBtn.style.display = "block";
        disconnectBtn.style.display = "none";
    });
}

// --- 6. GESTIONE RICARICA ---
if(rechargeBtn){
    rechargeBtn.addEventListener('click', () => {
        let importo = prompt("Inserire l'importo da ricaricare (es. 5.00): ");

        if (importo && !isNaN(parseFloat(importo)) && parseFloat(importo) > 0) {
            statusMsg.textContent = "🔄 Elaborazione ricarica...";

            fetch(RECHARGE_API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    username: loggedUser,
                    importo: parseFloat(importo)
                })
            })
                .then(res => res.json())
                .then(data => {
                    alert("Ricarica effettuata!");
                    caricaDati(); // Aggiorna i soldi a video
                    statusMsg.textContent = "💰 Credito aggiornato.";
                })
                .catch(err => {
                    alert("Errore ricarica: " + err);
                    statusMsg.textContent = "Errore durante la ricarica.";
                });
        } else {
            alert("Importo non valido.");
        }
    });
}

// --- 7. LOGOUT ---
const btnLogout = document.getElementById("logout-btn");
if(btnLogout) {
    btnLogout.addEventListener("click", () => {
        // Pulisce la memoria e torna al login
        localStorage.removeItem("username_loggato");
        localStorage.removeItem("ruolo_utente");
        window.location.href = "../login.html";
    });
}