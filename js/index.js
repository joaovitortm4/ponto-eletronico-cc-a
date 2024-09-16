function getUserLocation(){
    navigator.geolocation.getCurrentPosition((position) => {
        let userLocation = {
            "lat": position.coords.latitude,
            "long": position.coords.longitude
        }
        return userLocation;
    });
}

//Como garantir que uma função assíncrona ja foi executada/processada?
//Possiveis soluções

//getUserLocation(functionCallback){
    //navigator.geolocation.getCurrentPosition((position) => {
        //OBJETO com let e long
        //}
        //functionCallback(userLocation)
    //})
//}

//OU

//getUserLocation(){
    //return new Promise((suc, fai) => {
        //navigator.geolocation.getCurrentPosition()
    //})
//}

navigator.geolocation.getCurrentPosition(() => {
    console.log(position);
});

const diaSemana = document.getElementById("dia-semana");
const dataAtual = document.getElementById("data-atual");
const horaAtual = document.getElementById("hora-atual");

const btnRegistrarPonto = document.getElementById("btn-registrar-ponto");
btnRegistrarPonto.addEventListener("click", register);

function register(){
    //alert("Bater ponto!");
    dialogPonto.showModal();
}

diaSemana.textContent = getWeekDay();
dataAtual.textContent = getCurrenteDate();

const dialogPonto = document.getElementById("dialog-ponto");

const dialogData = document.getElementById("dialog-data");
dialogData.textContent = getCurrenteDate();

const dialogHora = document.getElementById("dialog-hora");
dialogHora.textContent = getCurrenteTime();

const feharDialog = document.getElementById("fechar-dialog");
feharDialog.addEventListener("click", () => {
    dialogPonto.close();
});



let RegistersLocalStorage = getRegisterLocalStorage("register");



function saveRegisterLocalStorage(register){

    RegistersLocalStorage.push(register);

    localStorage.setItem("register", JSON.stringify(register));
}

function getRegisterLocalStorage(key){

    let registers = localStorage.getItem(key);

    if(registers){
        return[];
    }

    return JSON.parse(registers);
}

/*
const entradaTrabalho = document.getElementById("entrada-trabalho");
entradaTrabalho.addEventListener("click", () => {
    saveRegisterLocalStorage(getObjectRegister("entrada"));
});

const saidaTrabalho = document.getElementById("saida-trabalho");
saidaTrabalho.addEventListener("click", () => {
    saveRegisterLocalStorage(getObjectRegister("saida"));
});
*/

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
btnDialogRegister.addEventListener("click", () =>{

    let register = getObjectRegister(selectRegisterType.value);
    saveRegisterLocalStorage(register);

    localStorage.setItem("lastRegisterType", selectRegisterType.value);

    dialogPonto.close();

});

function getObjectRegister(registerType){
    getUserLocation();

    ponto = {
        "date": getCurrenteDate(),
        "time": getCurrenteTime(),
        "location": getUserLocation(),
        "id": 1,
        "type": registerType
    }
    return ponto;
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