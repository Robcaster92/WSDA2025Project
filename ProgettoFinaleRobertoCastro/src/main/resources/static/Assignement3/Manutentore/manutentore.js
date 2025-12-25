window.onload = function() {
    console.log("--- JS MANUTENTORE CARICATO ---");

    // Riferimenti agli elementi principali
    const connectBtn = document.getElementById('connect-btn');
    const disconnectBtn = document.getElementById('disconnect-btn');
    const globalLogoutBtn = document.getElementById('global-logout-btn');
    const inputField = document.getElementById("machine-id");
    const connectionPanel = document.getElementById("connection-panel");
    const statusPanel = document.getElementById('machine-status');
    const welcomeLabel = document.getElementById("welcome-msg");

    // --- FUNZIONE PER GESTIRE IL LAYOUT DINAMICO ---
    function setBodyStyle(isDashboardOpen) {
        if (isDashboardOpen) {
            // QUANDO APRI LA DASHBOARD (Contenuto lungo)
            // Rimuoviamo il vincolo 100vh e allineiamo in alto per permettere lo scroll
            document.body.style.height = "auto";
            document.body.style.minHeight = "100vh"; // Assicura che copra almeno tutto lo schermo
            document.body.style.alignItems = "flex-start"; // Allinea in alto invece che al centro
            document.body.style.padding = "40px 0"; // Aggiunge spazio sopra e sotto
        } else {
            // QUANDO CHIUDI LA DASHBOARD (Contenuto corto)
            // Torniamo al centro perfetto
            document.body.style.height = "100vh";
            document.body.style.minHeight = "unset";
            document.body.style.alignItems = "center";
            document.body.style.padding = "0";
        }
    }

    // --- 1. RECUPERO NOME UTENTE ---
    const loggedUser = localStorage.getItem("username_loggato");

    if (loggedUser) {
        // Mostra subito username locale intanto che carica quello vero
        if(welcomeLabel) welcomeLabel.textContent = "Ciao, " + loggedUser;

        // Chiama il server per il nome completo
        fetch("http://localhost:8081/api/utente/info?username=" + loggedUser)
            .then(res => res.json())
            .then(data => {
                if(data.user_name && welcomeLabel) {
                    welcomeLabel.textContent = "Ciao, " + data.user_name;
                }
            })
            .catch(err => console.log("Impossibile recuperare nome completo:", err));
    } else {
        // Se non c'è login, manda alla pagina di login
        window.location.href = "../login.html";
    }

    // --- 2. TASTO CONNETTI ---
    if (connectBtn) {
        connectBtn.onclick = function() {
            let id = inputField.value.trim();
            if (!id) {
                alert("Inserisci un ID valido.");
                return;
            }

            // Chiamata API
            fetch("http://localhost:8081/api/distributore/" + id)
                .then(response => {
                    if (response.ok) return response.json();
                    throw new Error("Distributore non trovato");
                })
                .then(data => {
                    console.log("Dati Macchina:", data);

                    // Nascondi pannello connessione
                    connectionPanel.style.display = "none";

                    // Mostra dashboard
                    statusPanel.classList.remove('hidden');
                    statusPanel.style.display = "block";

                    // *** FIX LAYOUT: Allinea in alto per permettere lo scroll ***
                    setBodyStyle(true);

                    // Popola i campi
                    popolaDati(data);
                })
                .catch(error => {
                    alert("Errore: " + error.message);
                });
        };
    }

    // --- 3. TASTO DISCONNETTI DA MACCHINA ---
    if (disconnectBtn) {
        disconnectBtn.onclick = function() {
            // Nascondi dashboard
            statusPanel.style.display = "none";

            // Mostra pannello connessione
            connectionPanel.style.display = "block";

            // *** FIX LAYOUT: Torna al centro ***
            setBodyStyle(false);

            // Pulisci input
            inputField.value = "";
        };
    }

    // --- 4. TASTO ESCI DALL'ACCOUNT ---
    if (globalLogoutBtn) {
        globalLogoutBtn.onclick = function() {
            localStorage.removeItem("username_loggato");
            localStorage.removeItem("ruolo_utente");
            window.location.href = "../login.html";
        };
    }
};

// --- FUNZIONE PER RIEMPIRE I DATI A VIDEO ---
function popolaDati(dati) {
    // Helper per scrivere nei campi se esistono
    function scrivi(id, testo) {
        const el = document.getElementById(id);
        if (el) el.textContent = testo;
    }

    scrivi("machine-id-label", dati.id);
    scrivi("machine-type-label", dati.modello);
    scrivi("machine-site-label", dati.posizione);
    scrivi("machine-manutentore-label", dati.nomeManutentore || "Nessuno");

    // Stato Online/Offline
    const statoEl = document.getElementById("machine-state-label");
    if(statoEl) statoEl.textContent = (dati.stato === "Online") ? "Online 🟢" : "Offline 🔴";

    // Parametri Tecnici
    if (dati.parametriTecnici) {
        scrivi("machine-temp-label", dati.parametriTecnici.temperatura + "°C");
        scrivi("machine-bar-label", dati.parametriTecnici.pressione + " bar");
        scrivi("machine-water-label", dati.parametriTecnici.acquaQty + " L");
        scrivi("machine-sugar-label", dati.parametriTecnici.zuccheroQty + " g");
        scrivi("machine-glass-label", dati.parametriTecnici.bicchieriNum);
    }

    scrivi("machine-manut-label", dati.ultimaManutenzione || "Mai");

    // Scorte
    if (dati.scorte) {
        dati.scorte.forEach(scorta => {
            // Pulisci il nome (es. "Caffè" -> "caffe")
            let nome = scorta.bevanda.nome.toLowerCase();
            if(nome.includes("caff")) nome = "caffe";
            else if(nome.includes("latte")) nome = "caffelatte";
            else if(nome.includes("appucc")) nome = "cappuccino";
            else if(nome.includes("iocco")) nome = "cioccolata";
            else if(nome.includes("th") || nome.includes("tè")) nome = "the";

            let bar = document.getElementById(nome + "pblvl");
            let txt = document.getElementById(nome + "-level-percent");

            if (bar && txt) {
                let max = scorta.maxQuantita || 100;
                let val = scorta.quantita || 0;
                let perc = Math.round((val / max) * 100);

                txt.textContent = perc + "%";
                bar.style.width = perc + "%";

                // Colori
                bar.style.backgroundColor = "green";
                if (perc < 50) bar.style.backgroundColor = "orange";
                if (perc < 20) bar.style.backgroundColor = "red";
            }
        });
    }

    // Lista Guasti
    const ul = document.getElementById("error-list");
    if (ul) {
        ul.innerHTML = "";
        if (dati.guasti && dati.guasti.length > 0) {
            dati.guasti.forEach(guasto => {
                let li = document.createElement("li");
                li.textContent = "⚠️ " + guasto.messaggio;
                li.style.color = "#ff8a80";
                ul.appendChild(li);
            });
        } else {
            let li = document.createElement("li");
            li.textContent = "✅ Nessun guasto rilevato";
            li.style.color = "lightgreen";
            ul.appendChild(li);
        }
    }
}