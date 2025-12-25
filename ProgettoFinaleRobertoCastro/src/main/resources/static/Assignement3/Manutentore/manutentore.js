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
            document.body.style.height = "auto";
            document.body.style.minHeight = "100vh";
            document.body.style.alignItems = "flex-start";
            document.body.style.padding = "40px 0";
        } else {
            document.body.style.height = "100vh";
            document.body.style.minHeight = "unset";
            document.body.style.alignItems = "center";
            document.body.style.padding = "0";
        }
    }

    // --- 1. RECUPERO NOME UTENTE ---
    const loggedUser = localStorage.getItem("username_loggato");

    if (loggedUser) {
        if(welcomeLabel) welcomeLabel.textContent = "Ciao, " + loggedUser;
        fetch("http://localhost:8081/api/utente/info?username=" + loggedUser)
            .then(res => res.json())
            .then(data => {
                if(data.user_name && welcomeLabel) {
                    welcomeLabel.textContent = "Ciao, " + data.user_name;
                }
            })
            .catch(err => console.log("Impossibile recuperare nome completo:", err));
    } else {
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

            fetch("http://localhost:8081/api/distributore/" + id)
                .then(response => {
                    if (response.ok) return response.json();
                    throw new Error("Distributore non trovato");
                })
                .then(data => {
                    console.log("Dati Macchina:", data);
                    connectionPanel.style.display = "none";
                    statusPanel.classList.remove('hidden');
                    statusPanel.style.display = "block";
                    setBodyStyle(true);
                    popolaDati(data);
                })
                .catch(error => {
                    alert("Errore: " + error.message);
                });
        };
    }

    // --- 3. TASTO DISCONNETTI ---
    if (disconnectBtn) {
        disconnectBtn.onclick = function() {
            statusPanel.style.display = "none";
            connectionPanel.style.display = "block";
            setBodyStyle(false);
            inputField.value = "";
        };
    }

    // --- 4. TASTO LOGOUT ---
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
    function scrivi(id, testo) {
        const el = document.getElementById(id);
        if (el) el.textContent = testo;
    }

    scrivi("machine-id-label", dati.id);
    scrivi("machine-type-label", dati.modello);
    scrivi("machine-site-label", dati.posizione);
    scrivi("machine-manutentore-label", dati.nomeManutentore || "Nessuno");

    const statoEl = document.getElementById("machine-state-label");
    if(statoEl) statoEl.textContent = (dati.stato === "Online") ? "Online 🟢" : "Offline 🔴";

    if (dati.parametriTecnici) {
        scrivi("machine-temp-label", dati.parametriTecnici.temperatura + "°C");
        scrivi("machine-bar-label", dati.parametriTecnici.pressione + " bar");
        scrivi("machine-water-label", dati.parametriTecnici.acquaQty + " L");
        scrivi("machine-sugar-label", dati.parametriTecnici.zuccheroQty + " g");
        scrivi("machine-glass-label", dati.parametriTecnici.bicchieriNum);
    }

    scrivi("machine-manut-label", dati.ultimaManutenzione || "Mai");

    // --- SCORTE (CORREZIONE QUI SOTTO) ---
    if (dati.scorte) {
        dati.scorte.forEach(scorta => {
            let nome = scorta.bevanda.nome.toLowerCase();

            // FIX: Controlliamo "latte" PRIMA di "caff" per intercettare Caffellatte correttamente
            if(nome.includes("latte")) nome = "caffellatte";
            else if(nome.includes("caff")) nome = "caffe";
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

                bar.style.backgroundColor = "green";
                if (perc < 50) bar.style.backgroundColor = "orange";
                if (perc < 20) bar.style.backgroundColor = "red";
            }
        });
    }

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