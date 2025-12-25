document.addEventListener('DOMContentLoaded', () => {
    console.log("--- JS MANUTENTORE AVVIATO ---");

    // --- 1. GESTIONE NOME UTENTE (Safe Mode) ---
    // Anche se fallisce, non blocca lo script
    try {
        const loggedUser = localStorage.getItem("username_loggato");
        const welcomeLabel = document.getElementById("welcome-msg");

        if (!loggedUser) {
            console.warn("Nessun utente loggato. Reindirizzo...");
            // Scommenta la riga sotto per attivare il redirect obbligatorio
            // window.location.href = "../login.html";
        } else if (welcomeLabel) {
            // Tentativo di fetch del nome reale
            fetch("http://localhost:8081/api/utente/info?username=" + loggedUser)
                .then(res => {
                    if(!res.ok) throw new Error("API Info Utente fallita");
                    return res.json();
                })
                .then(data => {
                    welcomeLabel.textContent = "Ciao, " + (data.user_name || loggedUser);
                })
                .catch(err => {
                    console.error("Errore recupero nome:", err);
                    welcomeLabel.textContent = "Ciao, " + loggedUser;
                });
        }
    } catch (e) {
        console.error("Errore blocco Utente:", e);
    }

    // --- 2. DEFINIZIONE ELEMENTI DOM ---
    const connectBtn = document.getElementById('connect-btn');
    const disconnectBtn = document.getElementById('disconnect-btn');
    const globalLogoutBtn = document.getElementById('global-logout-btn');

    const inputField = document.getElementById("machine-id");

    const connectionPanel = document.getElementById("connection-panel");
    const statusPanel = document.getElementById('machine-status');

    // --- 3. EVENTO CONNETTI (Logica display: none diretta) ---
    if (connectBtn) {
        connectBtn.addEventListener('click', () => {
            console.log("Click su CONNETTI");

            // Validazione Input
            if (!inputField || inputField.value.trim() === "") {
                alert("Inserisci un ID valido!");
                return;
            }

            const idMacchina = inputField.value.trim();
            const API_URL = "http://localhost:8081/api/distributore/" + idMacchina;

            // Chiamata API
            fetch(API_URL)
                .then(response => {
                    if (response.ok) return response.json();
                    throw new Error("Distributore non trovato o Offline");
                })
                .then(data => {
                    console.log("Dati ricevuti:", data);

                    // A. NASCONDI Pannello Connessione
                    if(connectionPanel) connectionPanel.style.display = "none";

                    // B. MOSTRA Dashboard
                    if(statusPanel) {
                        statusPanel.classList.remove('hidden'); // Rimuovi classe css
                        statusPanel.style.display = "block";    // Forza stile inline
                    }

                    // C. Popola i dati
                    popolaDatiSafe(data);
                })
                .catch(err => {
                    console.error("Errore Fetch:", err);
                    alert("Errore: " + err.message);
                });
        });
    } else {
        console.error("Bottone connect-btn NON trovato!");
    }

    // --- 4. EVENTO DISCONNETTI MACCHINA ---
    if (disconnectBtn) {
        disconnectBtn.addEventListener('click', () => {
            console.log("Click su DISCONNETTI MACCHINA");

            // A. NASCONDI Dashboard
            if(statusPanel) {
                statusPanel.style.display = "none";
            }

            // B. MOSTRA Pannello Connessione
            if(connectionPanel) {
                connectionPanel.style.display = "block";
            }

            // C. Pulisci Input
            if(inputField) inputField.value = "";
        });
    }

    // --- 5. EVENTO LOGOUT GLOBALE ---
    if (globalLogoutBtn) {
        globalLogoutBtn.addEventListener('click', () => {
            if(confirm("Vuoi uscire dall'account?")) {
                localStorage.removeItem("username_loggato");
                localStorage.removeItem("ruolo_utente");
                window.location.href = "../login.html";
            }
        });
    }
});

// --- FUNZIONE POPOLAMENTO DATI (Esterna e Sicura) ---
function popolaDatiSafe(dati) {
    // Helper per settare testo se l'elemento esiste
    const setText = (id, text) => {
        const el = document.getElementById(id);
        if(el) el.textContent = text;
    };

    setText("machine-id-label", dati.id);
    setText("machine-type-label", dati.modello);
    setText("machine-site-label", dati.posizione);
    setText("machine-manutentore-label", dati.nomeManutentore || "Non assegnato");

    const stateEl = document.getElementById("machine-state-label");
    if(stateEl) stateEl.textContent = (dati.stato === "Online") ? "Online 🟢" : "Offline 🔴";

    // Parametri
    if (dati.parametriTecnici) {
        setText("machine-temp-label", dati.parametriTecnici.temperatura + "°C");
        setText("machine-bar-label", dati.parametriTecnici.pressione + " bar");
        setText("machine-water-label", dati.parametriTecnici.acquaQty + " L");
        setText("machine-sugar-label", dati.parametriTecnici.zuccheroQty + " g");
        setText("machine-glass-label", dati.parametriTecnici.bicchieriNum);
    }

    setText("machine-manut-label", dati.ultimaManutenzione || "Mai");

    // Scorte
    if (dati.scorte) {
        dati.scorte.forEach(scorta => {
            // Pulisci il nome per trovare l'ID (es. "Caffè" -> "caffe")
            let nomeClean = scorta.bevanda.nome.toLowerCase()
                .replace(/[^a-z]/g, "") // Rimuove tutto ciò che non è lettera
                .replace("th", "the");  // Fix per thè/the se serve

            // Mappatura manuale se la regex fallisce
            if(scorta.bevanda.nome.toLowerCase().includes("caff")) nomeClean = "caffe";
            if(scorta.bevanda.nome.toLowerCase().includes("latte")) nomeClean = "caffelatte";
            if(scorta.bevanda.nome.toLowerCase().includes("appucc")) nomeClean = "cappuccino";
            if(scorta.bevanda.nome.toLowerCase().includes("iocco")) nomeClean = "cioccolata";
            if(scorta.bevanda.nome.toLowerCase().includes("th") || scorta.bevanda.nome.toLowerCase().includes("tè")) nomeClean = "the";

            const bar = document.getElementById(nomeClean + "pblvl");
            const txt = document.getElementById(nomeClean + "-level-percent");

            if (bar && txt) {
                let max = scorta.maxQuantita || 100;
                let val = scorta.quantita || 0;
                let perc = Math.round((val / max) * 100);

                txt.textContent = perc + "%";
                bar.style.width = perc + "%";

                bar.style.backgroundColor = (perc < 30) ? "red" : (perc < 60 ? "yellow" : "green");
            }
        });
    }

    // Guasti
    const ul = document.getElementById("error-list");
    if (ul) {
        ul.innerHTML = "";
        if (dati.guasti && dati.guasti.length > 0) {
            dati.guasti.forEach(g => {
                let li = document.createElement("li");
                li.textContent = "⚠️ " + g.messaggio;
                li.style.color = "#ff8a80";
                ul.appendChild(li);
            });
        } else {
            let li = document.createElement("li");
            li.textContent = "✅ Nessun guasto attivo";
            li.style.color = "lightgreen";
            ul.appendChild(li);
        }
    }
}