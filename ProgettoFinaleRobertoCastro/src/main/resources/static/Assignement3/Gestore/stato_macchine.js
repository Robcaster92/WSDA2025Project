window.onload = function() {
    console.log("--- STATO MACCHINE LIVE CARICATO ---");

    const loggedUser = localStorage.getItem("username_loggato");
    if (!loggedUser) {
        alert("Login richiesto!");
        window.location.href = "../login.html";
        return;
    }

    const welcomeLabel = document.getElementById("welcome-msg");
    if(welcomeLabel) welcomeLabel.textContent = "Utente: " + loggedUser;

    const API_URL = "http://localhost:8081/api/distributore";
    const tableBody = document.querySelector("#stato-table tbody");
    const refreshBtn = document.getElementById("refresh-btn");
    const logoutBtn = document.getElementById("logout-btn");

    function caricaStato() {
        fetch(API_URL + "/all")
            .then(res => res.json())
            .then(data => {
                tableBody.innerHTML = "";

                if(data.length === 0) {
                    tableBody.innerHTML = "<tr><td colspan='6'>Nessun distributore monitorato.</td></tr>";
                    return;
                }

                data.forEach(macchina => {
                    const row = document.createElement("tr");

                    // 1. ANALISI STATO
                    let statoHtml = macchina.stato === "Online"
                        ? "<span style='color: lightgreen; font-weight: bold;'>Online 🟢</span>"
                        : "<span style='color: #ff8a80; font-weight: bold;'>Offline 🔴</span>";

                    if(macchina.stato === "Manutenzione") statoHtml = "<span style='color: orange;'>Manutenzione 🛠️</span>";

                    // 2. ANALISI GUASTI
                    let guastiHtml = "✅ Nessuno";
                    if (macchina.guasti && macchina.guasti.length > 0) {
                        guastiHtml = `<span style="color: #ff8a80;">⚠️ ${macchina.guasti.length} Guasti</span>`;
                    }

                    // 3. ANALISI SCORTE (Critiche se < 20%)
                    let scorteHtml = "✅ Ok";
                    let scorteCritiche = [];

                    if (macchina.scorte) {
                        macchina.scorte.forEach(s => {
                            let perc = (s.quantita / s.maxQuantita) * 100;
                            if (perc < 20) {
                                scorteCritiche.push(s.bevanda.nome); // Aggiunge nome bevanda
                            }
                        });
                    }

                    if (scorteCritiche.length > 0) {
                        scorteHtml = `<span style="color: orange;">⚠️ ${scorteCritiche.join(", ")}</span>`;
                    }

                    // 4. DATA CHECK (Usiamo l'ultima manutenzione come riferimento temporale o la data odierna)
                    let lastCheck = macchina.ultimaManutenzione || new Date().toLocaleDateString();

                    row.innerHTML = `
                        <td><strong>${macchina.id}</strong></td>
                        <td>${macchina.posizione}</td>
                        <td>${statoHtml}</td>
                        <td>${guastiHtml}</td>
                        <td>${scorteHtml}</td>
                        <td style="font-size: 0.8rem; color: #ccc;">${lastCheck}</td>
                    `;
                    tableBody.appendChild(row);
                });
            })
            .catch(err => {
                console.error(err);
                tableBody.innerHTML = "<tr><td colspan='6' style='color:red;'>Errore connessione server.</td></tr>";
            });
    }

    if(refreshBtn) refreshBtn.onclick = caricaStato;

    if(logoutBtn) {
        logoutBtn.onclick = function() {
            localStorage.removeItem("username_loggato");
            window.location.href = "../login.html";
        };
    }

    // Caricamento iniziale e Auto-Refresh ogni 10 secondi
    caricaStato();
    setInterval(caricaStato, 10000); // Polling ogni 10 sec
};