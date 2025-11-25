const creditoEl = document.getElementById('credito');
const MsgEl = document.getElementById('msg');
const confermaBtn = document.getElementById('conferma');
const bevandaSel = document.getElementById('beverage');
const progressBar = document.getElementById('progress-bar');
const progressBarDiv = document.getElementById('pbdiv');
const messageDiv = document.getElementById('msg');
const url = "../XML/dati.json";
let credito = 999999;
let modified = true;


function checkCredit() {
    if(modified) {
        fetch(url)
            .then(response => response.json())
            .then(data => {
                //console.log("Utente:", data.nome);
                //console.log("Credito:", data.credito);
                credito = data.credito;
                document.getElementById('nome').textContent = data.user_name;
                document.getElementById('credito').textContent = data.credito;
                modified = false;
            })
            .catch(error => console.error("Errore:", error));
    }
}

checkCredit()
//QUI DI SEGUITO C'E' LA FUNZIONA PERIODICA CHE SI RIPETE OGNI 10 SECONDI
setInterval(checkCredit,10000);


//event listener per la conferma
confermaBtn.addEventListener('click', () => {
    const costo = parseFloat(bevandaSel.value);

    //verifica il credito
    if (credito < costo) {
        MsgEl.textContent = "❌ Credito insufficiente!";
        return;
    }
    //logica del pagamento
    alert("Premere \"ok\" per confermare l'erogazione!\nCredito: " + credito + "€ => " + (credito -= costo) + "€")
    document.getElementById("conferma").style.display = "None";
    progressBarDiv.style.display = "Block"
    messageDiv.style.display = "Block"
    modified = true;
    console.log("File JSON aggiornato!");
    creditoEl.textContent = credito.toFixed(2);
    MsgEl.textContent = "Preparazione in corso...";
    progressBarDiv.style.display = "Block"
    progressBar.style.width = "0%";
    progressBar.classList.add("active");
    //incremento progress bar
    let progress = 0;
    const interval = setInterval(() => {
        progress += 5;
        progressBar.style.width = progress + "%";
        //messaggio di fine preparazione
        if (progress >= 100) {
            clearInterval(interval);
            progressBar.classList.remove("active");
            MsgEl.textContent = "✅ Il tuo caffè è pronto!";
            document.getElementById("conferma").style.display = "Block";
            progressBarDiv.style.display = "None";
            messageDiv.style.display = "None";
        }
    }, 100);
});