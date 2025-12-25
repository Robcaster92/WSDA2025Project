window.onload = function() {
    console.log("--- DASHBOARD GESTORE CARICATA ---");

    const welcomeLabel = document.getElementById("welcome-msg");
    const logoutBtn = document.getElementById("logout-btn");

    // 1. VERIFICA LOGIN E RUOLO
    const loggedUser = localStorage.getItem("username_loggato");
    const userRole = localStorage.getItem("ruolo_utente"); // Assumiamo che tu abbia salvato il ruolo al login

    if (!loggedUser) {
        alert("Accesso non autorizzato. Effettua il login.");
        window.location.href = "../login.html";
        return;
    }

    // (Opzionale) Controllo Ruolo se lo hai salvato
    // if (userRole !== "GESTORE") {
    //     alert("Non hai i permessi per accedere qui.");
    //     window.location.href = "../login.html";
    // }

    // 2. MOSTRA NOME UTENTE
    // Prima mostra quello locale
    if(welcomeLabel) welcomeLabel.textContent = "Ciao, " + loggedUser;

    // Poi prova a recuperare il nome completo dal server
    fetch("http://localhost:8081/api/utente/info?username=" + loggedUser)
        .then(res => res.json())
        .then(data => {
            if (data.user_name && welcomeLabel) {
                welcomeLabel.textContent = "Ciao, " + data.user_name + " (Gestore)";
            }
        })
        .catch(err => console.error("Errore recupero nome:", err));


    // 3. LOGOUT
    if (logoutBtn) {
        logoutBtn.onclick = function() {
            if(confirm("Vuoi davvero uscire?")) {
                localStorage.removeItem("username_loggato");
                localStorage.removeItem("ruolo_utente");
                window.location.href = "../login.html";
            }
        };
    }
};