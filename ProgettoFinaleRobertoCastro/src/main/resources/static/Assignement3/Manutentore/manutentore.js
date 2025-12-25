// Riferimenti HTML
const machineidText = document.getElementById("machine-id-label");
const machinetypeText = document.getElementById("machine-type-label");
const machinesiteText = document.getElementById("machine-site-label");
const machinestateText = document.getElementById("machine-state-label");
const machinetempText = document.getElementById("machine-temp-label");
const machinebarText = document.getElementById("machine-bar-label");
const machinewaterText = document.getElementById("machine-water-label");
const machinesugarText = document.getElementById("machine-sugar-label");
const machineglassText = document.getElementById("machine-glass-label");
const machinemanutText = document.getElementById("machine-manut-label");
const machinemanutentoreText = document.getElementById("machine-manutentore-label");

const connectBtn = document.getElementById('connect-btn');
const inputField = document.getElementById("machine-id");

// URL Base del backend (Porta 8081 corretta)
const API_URL = "http://localhost:8081/api/distributore/";

// --- LOGICA CONNESSIONE ---
connectBtn.addEventListener('click', () => {
    let id = inputField.value.trim();

    if(id) {
        // Chiama il server Java
        fetch(API_URL + id)
            .then(response => {
                if(response.ok) return response.json();
                throw new Error("Distributore non trovato");
            })
            .then(data => {
                console.log("Dati ricevuti:", data);

                // Mostra il pannello
                document.getElementById('machine-status').classList.remove('hidden');
                document.body.style.height = "100%";

                // Popola i dati a video
                popolaDati(data);
            })
            .catch(error => {
                console.error(error);
                alert("Errore: " + error.message + "\nControlla che l'ID sia corretto (es. 1012)");
            });
    } else {
        alert("Inserisci un ID valido.");
    }
});

function popolaDati(dati) {
    // 1. Dati Generali
    machineidText.textContent = dati.id;
    machinetypeText.textContent = dati.modello;
    machinesiteText.textContent = dati.posizione;

    if(document.getElementById("machine-manutentore-label")) {
        document.getElementById("machine-manutentore-label").textContent = dati.nomeManutentore || "Nessuno";
    }

    if(dati.stato === "Online"){
        machinestateText.textContent = "Online 🟢";
    } else {
        machinestateText.textContent = "Offline 🔴";
    }

    // 2. Parametri Tecnici
    if (dati.parametriTecnici) {
        machinetempText.textContent = dati.parametriTecnici.temperatura + "°C";
        machinebarText.textContent = dati.parametriTecnici.pressione + " bar";
        machinewaterText.textContent = dati.parametriTecnici.acquaQty + " L";
        machinesugarText.textContent = dati.parametriTecnici.zuccheroQty + " g";
        machineglassText.textContent = dati.parametriTecnici.bicchieriNum;
    }

    machinemanutText.textContent = dati.ultimaManutenzione || "Mai";

    // 3. Gestione Scorte (Bevande)
    // Mappa per collegare il nome DB all'ID della progress bar HTML
    const mapBevande = {
        "caffe": "caffe",
        "cappuccino": "cappuccino",
        "caffelatte": "caffelatte",
        "cioccolata": "cioccolata",
        "the": "the"
    };

    if (dati.scorte) {
        dati.scorte.forEach(scorta => {
            // Normalizziamo i nomi (toglie accenti e minuscolo)
            let nomeDb = scorta.bevanda.nome.toLowerCase().replace("è", "e").replace("thè", "the");

            let elementIdBar = nomeDb + "pblvl";
            let elementIdText = nomeDb + "-level-percent";

            let bar = document.getElementById(elementIdBar);
            let text = document.getElementById(elementIdText);

            if (bar && text) {
                let qty = scorta.quantita;
                let max = scorta.maxQuantita;
                let percent = Math.round((qty * 100) / max);

                text.textContent = percent + "%";
                bar.style.width = percent + "%";

                // Colori dinamici
                bar.style.backgroundColor = "green";
                if (percent < 66) bar.style.backgroundColor = "yellow";
                if (percent < 33) bar.style.backgroundColor = "red";
            }
        });
    }

    // 4. Guasti / Errori
    const ul = document.getElementById("error-list");
    ul.innerHTML = ""; // Pulisci lista vecchia

    if (dati.guasti && dati.guasti.length > 0) {
        dati.guasti.forEach(guasto => {
            const li = document.createElement("li");
            li.textContent = "⚠️ " + guasto.messaggio;
            li.style.color = "#ff8a80"; // Rosso chiaro
            ul.appendChild(li);
        });
    } else {
        const li = document.createElement("li");
        li.textContent = "✅ Nessun guasto rilevato";
        li.style.color = "lightgreen";
        ul.appendChild(li);
    }
}