//const di riferimento
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


//Accedo al file xml e prendo tutti i distributori con variabili interne
let urlXML = "../XML/machine_status.xml"
let macchineMap = {};
let inputText = 0
let errors = {};
let messages = {}
fetch(urlXML)
    .then(res => res.text())
    .then(xmlStr => {
        const xml = new DOMParser().parseFromString(xmlStr, "text/xml");

        const distributori = xml.getElementsByTagName("Distributore");
        for (let d of distributori) {
            const id = d.getElementsByTagName("ID")[0].textContent;
            macchineMap[id] = d; // salva il nodo con chiave ID
        }
    });

const connectBtn = document.getElementById('connect-btn');

connectBtn.addEventListener('click', () => {
    inputText = document.getElementById("machine-id").value;
    if(inputText in macchineMap){
        console.log("Trovato:", inputText);
        document.getElementById('machine-status').classList.remove('hidden');
        document.body.style.height = "100%";
        loadData();
    } else {
        console.log("Non trovato:", inputText);
        alert("Il seguente ID: " + inputText + " non è presente nel sistema!\nAccertati di averlo inserito correttamente!")
    }
});

function loadData(){
    console.log(macchineMap[inputText]);
    const id = macchineMap[inputText].getElementsByTagName("ID")[0].textContent;
    machineidText.textContent = id;

    const modello = macchineMap[inputText].getElementsByTagName("Modello")[0].textContent;
    machinetypeText.textContent = modello;

    const posizione = macchineMap[inputText].getElementsByTagName("Posizione")[0].textContent;
    machinesiteText.textContent = posizione;

    const stato = macchineMap[inputText].getElementsByTagName("Stato")[0].textContent;
    if(stato == "Online"){
        machinestateText.textContent = stato + "🟢"
    }else{
        machinestateText.textContent = stato + "🔴"
    }

    const temp = macchineMap[inputText].getElementsByTagName("Temperatura")[0].textContent
    machinetempText.textContent = temp + "°C";

    const pressione = macchineMap[inputText].getElementsByTagName("Pressione")[0].textContent;
    machinebarText.textContent = pressione + " bar";

    const acqua = macchineMap[inputText].getElementsByTagName("AcquaQty")[0].textContent;
    machinewaterText.textContent = acqua + " L"

    const zucchero = macchineMap[inputText].getElementsByTagName("ZuccheroQty")[0].textContent;
    machinesugarText.textContent = zucchero + " g"

    const bicchieri = macchineMap[inputText].getElementsByTagName("BicchieriNum")[0].textContent;
    machineglassText.textContent = bicchieri;

    const manut = macchineMap[inputText].getElementsByTagName("UltimaManutenzione")[0].textContent;
    machinemanutText.textContent = manut;

    const addetto = macchineMap[inputText].getElementsByTagName("AddettoResponsabile")[0].textContent;
    machinemanutentoreText.textContent = addetto;

    const caffe = macchineMap[inputText].getElementsByTagName("Bevanda")[0];
    //console.log(caffe);
    const caffelvl = caffe.getElementsByTagName("Quantity")[0].textContent;
    const maxcaffelvl = caffe.getElementsByTagName("MaxQuantity")[0].textContent;
    //console.log(caffelvl)
    //console.log(maxcaffelvl)
    //quantita percentuale
    const percentcaffe = (caffelvl * 100)/maxcaffelvl;
    console.log(percentcaffe)
    document.getElementById("caffe-level-percent").textContent = percentcaffe + "%"
    document.getElementById("caffepblvl").style.width = percentcaffe + "%";


    const cappuccino = macchineMap[inputText].getElementsByTagName("Bevanda")[1];
    const cappuccinolvl = cappuccino.getElementsByTagName("Quantity")[0].textContent;
    const maxcappuccinolvl = cappuccino.getElementsByTagName("MaxQuantity")[0].textContent;
    const percentcappuccino = (cappuccinolvl * 100)/maxcappuccinolvl;
    document.getElementById("cappuccino-level-percent").textContent = percentcappuccino + "%"
    document.getElementById("cappuccinopblvl").style.width = percentcappuccino + "%";


    const caffelatte = macchineMap[inputText].getElementsByTagName("Bevanda")[2];
    const caffelattelvl = caffelatte.getElementsByTagName("Quantity")[0].textContent;
    const maxcaffelattelvl = caffelatte.getElementsByTagName("MaxQuantity")[0].textContent;
    const percentcaffelatte = (caffelattelvl * 100)/maxcaffelattelvl;
    document.getElementById("caffelatte-level-percent").textContent = percentcaffelatte + "%"
    document.getElementById("caffelattepblvl").style.width = percentcaffelatte + "%";

    const cioccolata = macchineMap[inputText].getElementsByTagName("Bevanda")[3];
    const cioccolatalvl = cioccolata.getElementsByTagName("Quantity")[0].textContent;
    const maxcioccolatalvl = cioccolata.getElementsByTagName("MaxQuantity")[0].textContent;
    const percentcioccolata = (cioccolatalvl * 100)/maxcioccolatalvl;
    document.getElementById("cioccolata-level-percent").textContent = percentcioccolata + "%"
    document.getElementById("cioccolatapblvl").style.width = percentcioccolata + "%";

    const the = macchineMap[inputText].getElementsByTagName("Bevanda")[4];
    const thelvl = the.getElementsByTagName("Quantity")[0].textContent;
    const maxthelvl = the.getElementsByTagName("MaxQuantity")[0].textContent;
    const percentthe = (thelvl * 100)/maxthelvl;
    document.getElementById("the-level-percent").textContent = percentthe + "%"
    document.getElementById("thepblvl").style.width = percentthe + "%";

    const elementi = document.querySelectorAll(".progress-bar");
    console.log(elementi)
    elementi.forEach(elem => {
        const width = parseInt(elem.style.width);
        if (width <= 33) {
            elem.style.backgroundColor = "red";
        } else {
            if (width > 33 && width <= 66) {
                elem.style.backgroundColor = "yellow";
            } else {
                if (width > 66) {
                    elem.style.backgroundColor = "green";
                } else {

                }
            }
        }
    });
    const macchina = macchineMap[inputText];
    errors = macchina.getElementsByTagName("Errors")[0];
    messages = errors.getElementsByTagName("Message");
    console.log(messages.textContent)
    const ul = document.getElementById("error-list");
    ul.innerHTML = "<li></li>";
    Array.from(messages).forEach(msg => {
        const li = document.createElement("li");
        li.textContent = "⚠️ " + msg.textContent + " ⚠️"; // inserisce il testo del messaggio
        ul.appendChild(li);
    });
    ul.innerHTML += "<li></li>";
}