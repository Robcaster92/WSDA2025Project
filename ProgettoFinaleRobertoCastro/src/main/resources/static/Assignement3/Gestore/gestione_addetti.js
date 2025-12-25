window.onload = function() {
    console.log("--- GESTIONE ADDETTI CARICATA ---");

    const loggedUser = localStorage.getItem("username_loggato");
    if (!loggedUser) {
        alert("Login richiesto!");
        window.location.href = "../login.html";
        return;
    }

    const welcomeLabel = document.getElementById("welcome-msg");
    if(welcomeLabel) welcomeLabel.textContent = "Utente: " + loggedUser;

    // URL Backend
    const API_URL = "http://localhost:8081/api/utente";
    const tableBody = document.querySelector("#addetti-table tbody");
    const addBtn = document.getElementById("add-btn");
    const refreshBtn = document.getElementById("refresh-btn");
    const logoutBtn = document.getElementById("logout-btn");

    // 1. CARICA LISTA MANUTENTORI
    function caricaAddetti() {
        fetch(API_URL + "/manutentori")
            .then(res => {
                if(!res.ok) throw new Error("Errore server: " + res.status);
                return res.json();
            })
            .then(data => {
                tableBody.innerHTML = "";
                if(data.length === 0) {
                    tableBody.innerHTML = "<tr><td colspan='5'>Nessun manutentore trovato.</td></tr>";
                    return;
                }

                data.forEach(utente => {
                    const row = document.createElement("tr");
                    row.innerHTML = `
                        <td><strong>${utente.username}</strong></td>
                        <td>${utente.nome || '-'}</td>
                        <td>${utente.cognome || '-'}</td>
                        <td style="color: #ffcc80;">${utente.ruolo}</td>
                        <td>
                            <button class="delete-btn" onclick="eliminaAddetto('${utente.username}')">🗑️ Elimina</button>
                        </td>
                    `;
                    tableBody.appendChild(row);
                });
            })
            .catch(err => {
                console.error(err);
                tableBody.innerHTML = "<tr><td colspan='5' style='color:red;'>Errore connessione DB.</td></tr>";
            });
    }

    // 2. AGGIUNGI MANUTENTORE
    if(addBtn) {
        addBtn.onclick = function() {
            const nome = document.getElementById("new-nome").value.trim();
            const cognome = document.getElementById("new-cognome").value.trim();
            const user = document.getElementById("new-user").value.trim();
            const pass = document.getElementById("new-pass").value.trim();

            if(!user || !pass) {
                alert("Username e Password sono obbligatori!");
                return;
            }

            const payload = {
                username: user,
                password: pass,
                nome: nome,
                cognome: cognome,
                ruolo: "MANUTENTORE", // Forziamo il ruolo
                credito: 0.0
            };

            fetch(API_URL + "/registra", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            }).then(res => {
                if(res.ok) {
                    alert("Manutentore creato con successo!");
                    // Pulisci campi
                    document.getElementById("new-nome").value = "";
                    document.getElementById("new-cognome").value = "";
                    document.getElementById("new-user").value = "";
                    document.getElementById("new-pass").value = "";
                    caricaAddetti();
                } else {
                    res.text().then(t => alert("Errore: " + t));
                }
            }).catch(err => alert("Errore di rete: " + err));
        };
    }

    // 3. ELIMINA ADDETTO
    window.eliminaAddetto = function(username) {
        if(confirm("Eliminare definitivamente l'utente " + username + "?")) {
            fetch(API_URL + "/" + username, { method: "DELETE" })
                .then(res => {
                    if(res.ok) {
                        alert("Eliminato!");
                        caricaAddetti();
                    } else {
                        alert("Errore eliminazione");
                    }
                })
                .catch(err => alert("Errore: " + err));
        }
    };

    if(refreshBtn) refreshBtn.onclick = caricaAddetti;

    if(logoutBtn) {
        logoutBtn.onclick = function() {
            localStorage.removeItem("username_loggato");
            window.location.href = "../login.html";
        };
    }

    // Avvio
    caricaAddetti();
};