const connectBtn = document.getElementById("connect-btn")
const disconnectBtn = document.getElementById("disconnect-btn")
const rechargeBtn = document.getElementById("recharge-btn")
const url = "../XML/dati.json"
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

connectBtn.addEventListener('click', () => {
    let id = document.getElementById("machine-id").value;
    if(id.trim()){
        alert("connesso al distributore " + document.getElementById("machine-id").value + ".");
        document.getElementById("machine-id").value = "";
        document.getElementById("connect-btn").style.display = "none";
        document.getElementById("disconnect-btn").style.display = "block";
    }else{
        alert("Inserisci l'id della macchina");
    }
})
disconnectBtn.addEventListener('click', () => {
    alert("disconnesso dal distributore " + document.getElementById("machine-id").value + ".");
    document.getElementById("machine-id").value = "";
    document.getElementById("connect-btn").style.display = "block";
    document.getElementById("disconnect-btn").style.display = "none";

})
rechargeBtn.addEventListener('click', () => {
    let importo = prompt("Inserire l'importo da ricaricare: ");
    if (confirm("Confermare per ricaricare l'importo di " + importo)){
        let prevCredito = parseInt(document.getElementById("credito").textContent)
        let result = prevCredito + parseInt(importo)
        alert("Credito ricaricato da " + prevCredito + " a " + result);
        document.getElementById('credito').textContent = result;
    }else{
        alert("Transazione annullata!")
    }
})