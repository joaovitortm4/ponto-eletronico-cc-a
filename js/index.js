const diaSemana = document.getElementById("dia-semana");
const dataAtual = document.getElementById("data-atual");
const horaAtual = document.getElementById("hora-atual");
const btnRegistrarPonto = document.getElementById("btn-registrar-ponto");

btnRegistrarPonto.addEventListener("click", register);

diaSemana.textContent = getWeekDay();
dataAtual.textContent = getCurrenteDate();

const dialogPonto = document.getElementById("dialog-ponto");

const dialogData = document.getElementById("dialog-data");
dialogData.textContent = "Data: " + getCurrenteDate();

const dialogHora = document.getElementById("dialog-hora");
//dialogHora.textContent = getCurrenteTime();

const selectRegisterType = document.getElementById("register-type");

function setRegisterType(){
    let lastType = localStorage.getItem("lastRegisterType");
    if (lastType == "entrada"){
        selectRegisterType.value = "intervalo";
    }

    if (lastType == "intervalo"){
        selectRegisterType.value = "volta-intervalo";
    }
    
    if (lastType == "volta-intervalo"){
        selectRegisterType.value = "saida";
    }

    if (lastType == "saida"){
        selectRegisterType.value = "entrada";
    }
}

const btnDialogRegister = document.getElementById("btn-dialog-register");
btnDialogRegister.addEventListener("click", async () =>{

    let register = await getObjectRegister(selectRegisterType.value);
    saveRegisterLocalStorage(register);


    localStorage.setItem("lastRegister", JSON.stringify(register));


    const alertaSucesso = document.getElementById("alerta-ponto-registrado")
    alertaSucesso.classList.remove("hidden");
    alertaSucesso.classList.add("show");

    setTimeout(() => {
        alertaSucesso.classList.remove("show");
        alertaSucesso.classList.add("hidden");
    }, 5000);

    dialogPonto.close();

});

async function getObjectRegister(registerType){

    const location = await getUserLocation();

    ponto = {
        "date": getCurrenteDate(),
        "time": getCurrenteTime(),
        "location": location,
        "id": 1,
        "type": registerType
    }
    return ponto;
}

function getUserLocation(){
    navigator.geolocation.getCurrentPosition((position) => {
        let userLocation = {
            "lat": position.coords.latitude,
            "long": position.coords.longitude
        }
        return userLocation;
    });
}

const feharDialog = document.getElementById("fechar-dialog");
feharDialog.addEventListener("click", () => {
    dialogPonto.close();
});

let RegistersLocalStorage = getRegisterLocalStorage("register");


function saveRegisterLocalStorage(register){

    RegistersLocalStorage.push(register);
    localStorage.setItem("register", JSON.stringify(RegistersLocalStorage));
}

function getRegisterLocalStorage(key){

    let registers = localStorage.getItem(key);

    if(registers){
        return[];
    }

    return JSON.parse(registers);
}

function getUserLocation(){
    return new Promise((resolve, reject) =>{
        navigator.geolocation.getCurrentPosition((position) => {
            let userLocation = {
                "Latitude": position.coords.latitude,
                "Longitude": position.coords.longitude
            }
            resolve(userLocation);
        },
        (error) => {
            reject("Erro" + error);
        });
    });
}

function register(){

    const dialogUltimoRegistro = document.getElementById ("dialog-ultimo-registro");
    let lastRegister = JSON.parse(localStorage.getItem("lastRegister"));

    if(lastRegister) {
        let lastDateRegister = lastRegister.date;
        let lastTimeRegister = lastRegister.time;
        let lastRegisterType = lastRegister.type;

        dialogUltimoRegistro.textContent = "Último Registro: " + lastDateRegister + " | " + lastTimeRegister + " | " + lastRegisterType;
    }

    dialogHora.textContent = "Hora: " + getCurrenteTime();

     let interval = setInterval(() => {
        dialogHora.textContent = "Hora: " + getCurrenteTime();
     }, 1000);

     console.log(interval);

    dialogPonto.showModal();
}

function updateContentHour(){
    horaAtual.textContent = getCurrenteTime();
}

//retorna hora atual (horas/minutos/segundos)
function getCurrenteTime(){
    const date = new Date();

    return String(date.getHours()).padStart(2, '0') + ":" + String(date.getMinutes()).padStart(2, '0') + ":" + String(date.getSeconds()).padStart(2, '0');
}

//retorna a data atual no padra dd/mm/aa
function getCurrenteDate(){
    const date = new Date();

    let mes = date.getMonth() +1;

    return String(date.getDate()).padStart(2, '0') + "/" + String(mes).padStart(2, '0')  + "/" + String(date.getFullYear()).padStart(2, '0');
}

function getWeekDay(){
    const date = new Date()
    const day = date.getDay()
    const dayNames = ["Domingo", "Segunda-feira", "Terça-feira", "Quarta-feira", "Quinta-feira", "Sexta-feira", "Sábado"]
    return dayNames[day];
}

updateContentHour();
setInterval(updateContentHour, 1000);

console.log(getCurrenteTime());
console.log(getCurrenteDate());