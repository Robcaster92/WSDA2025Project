window.onload = function() {
    console.log("--- GESTIONE MACCHINE CARICATA ---");

    const loggedUser = localStorage.getItem("username_loggato");
    if (!loggedUser) {
        alert("Login richiesto!");
        window.location.href = "../../login.html";
        return;
    }

    // URL corretti per il controller aggiornato
    const API_URL = "http://localhost:8081/api/distributore";
    const tableBody = document.querySelector("#macchine-table tbody");
    const addBtn = document.getElementById("add-btn");
    const refreshBtn = document.getElementById("refresh-btn");

    function caricaMacchine() {
        fetch(API_URL + "/all")
            .then(res => {
                if(!res.ok) throw new Error("Errore server: " + res.status);
                return res.json();
            })
            .then(data => {
                tableBody.innerHTML = "";
                if(data.length === 0) {
                    tableBody.innerHTML = "<tr><td colspan='7'>Nessun distributore.</td></tr>";
                    return;
                }
                data.forEach(macchina => {
                    const row = document.createElement("tr");
                    let statoIcon = macchina.stato === "Online" ? "🟢" : "🔴";

                    row.innerHTML = `
                        <td><strong>${macchina.id}</strong></td>
                        <td>${macchina.modello}</td>
                        <td>${macchina.posizione}</td>
                        <td>${statoIcon} ${macchina.stato}</td>
                        <td>${macchina.nomeManutentore || '-'}</td>
                        <td>${macchina.ultimaManutenzione || '-'}</td>
                        <td><button class="delete-btn" onclick="elimina('${macchina.id}')">🗑️</button></td>
                    `;
                    tableBody.appendChild(row);
                });
            })
            .catch(err => {
                console.error(err);
                tableBody.innerHTML = "<tr><td colspan='7' style='color:red;'>Errore connessione DB. Verifica che il server sia avviato.</td></tr>";
            });
    }

    if(addBtn) {
        addBtn.onclick = function() {
            const id = document.getElementById("new-id").value;
            const model = document.getElementById("new-model").value;
            const site = document.getElementById("new-site").value;
            const status = document.getElementById("new-status").value;
            const maintainer = document.getElementById("new-maintainer").value;
            const date = document.getElementById("new-date").value;

            if(!id || !model) { alert("ID e Modello obbligatori"); return; }

            const payload = {
                id: id,
                modello: model,
                posizione: site,
                stato: status,
                nomeManutentore: maintainer,
                ultimaManutenzione: date || null
            };

            fetch(API_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            }).then(res => {
                if(res.ok) {
                    alert("Aggiunto!");
                    caricaMacchine();
                } else {
                    res.text().then(t => alert("Errore: " + t));
                }
            });
        };
    }

    window.elimina = function(id) {
        if(confirm("Eliminare ID " + id + "?")) {
            fetch(API_URL + "/" + id, { method: "DELETE" })
                .then(res => {
                    if(res.ok) caricaMacchine();
                    else alert("Errore eliminazione");
                });
        }
    };

    if(refreshBtn) refreshBtn.onclick = caricaMacchine;

    // Avvio
    caricaMacchine();
};