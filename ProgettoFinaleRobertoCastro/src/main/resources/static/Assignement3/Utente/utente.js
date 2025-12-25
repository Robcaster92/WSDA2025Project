// --- 1. CONTROLLO LOGIN ---
// Recupera lo username salvato nella memoria del browser durante il login
const loggedUser = localStorage.getItem("username_loggato");

// Se non c'è nessuno loggato, rimanda alla pagina di login
if (!loggedUser) {
    alert("Accesso negato! Effettua prima il login.");
    window.location.href = "../login.html"; // Assicurati che il percorso sia giusto
}

// Riferimenti agli elementi HTML della pagina
const welcomeLabel = document.getElementById("nome"); // O l'ID dove mostri il nome
const creditLabel = document.getElementById("credito"); // L'ID dove mostri il credito
const connectBtn = document.getElementById("connect-btn");
const machineInput = document.getElementById("machine-id");

// URL del Backend
const API_INFO = "http://localhost:8081/api/utente/info?username=" + loggedUser;
const API_RICARICA = "http://localhost:8081/api/ricarica";

// --- 2. CARICAMENTO DATI UTENTE ---
function caricaDatiUtente() {
    fetch(API_INFO)
        .then(response => {
            if (!response.ok) throw new Error("Utente non trovato");
            return response.json();
        })
        .then(data => {
            console.log("Dati utente:", data);

            // Aggiorna la pagina con i dati veri dal Database
            if(welcomeLabel) welcomeLabel.textContent = "Ciao, " + data.user_name;
            if(creditLabel) creditLabel.textContent = data.credito.toFixed(2) + " €";
        })
        .catch(err => {
            console.error(err);
            alert("Errore nel caricamento dati utente. Riprova il login.");
            localStorage.removeItem("username_loggato");
            window.location.href = "../login.html";
        });
}

// --- 3. FUNZIONE RICARICA ---
// Assicurati che il tuo bottone "Ricarica" nell'HTML chiami questa funzione o abbia un listener
function ricaricaCredito() {
    let importo = prompt("Quanto vuoi ricaricare? (es. 5.50)");
    if (importo && !isNaN(importo)) {
        fetch(API_RICARICA, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                username: loggedUser,
                importo: parseFloat(importo)
            })
        })
            .then(res => res.json())
            .then(data => {
                alert("Ricarica effettuata! Nuovo credito: " + data.nuovo_credito + " €");
                caricaDatiUtente(); // Aggiorna subito la scritta a video
            })
            .catch(err => alert("Errore ricarica: " + err));
    }
}

// Collegamento bottone ricarica (se ha id="recharge-btn")
const btnRicarica = document.getElementById("recharge-btn");
if(btnRicarica) {
    btnRicarica.addEventListener("click", ricaricaCredito);
}

// --- 4. FUNZIONE LOGOUT ---
const btnLogout = document.getElementById("logout-btn");
if(btnLogout) {
    btnLogout.addEventListener("click", () => {
        localStorage.removeItem("username_loggato");
        localStorage.removeItem("ruolo_utente");
        window.location.href = "../login.html";
    });
}

// Avvio automatico al caricamento della pagina
caricaDatiUtente();