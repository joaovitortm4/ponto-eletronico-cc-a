function getUserLocation(){
    navigator.geolocation.getCurrentPosition((position) => {
        let userLocation = {
            "lat": position.coords.latitude,
            "long": position.coords.longitude
        }
        return userLocation
    });
}

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

const entradaTrabalho = document.getElementById("entrada-trabalho");
entradaTrabalho.addEventListener("click", () => {
    
    let currentDate = getCurrenteDate();
    let currentTime = getCurrenteTime();
    let userLocation = getUserLocation();

    ponto = {
        "date": currentDate,
        "time": currentTime,
        "location": userLocation,
        "id": 1,
        "type": "entrada"
    }
});

const saidaTrabalho = document.getElementById("saida-trabalho");
saidaTrabalho.addEventListener("click", () => {

    let currentDate = getCurrenteDate();
    let currentTime = getCurrenteTime();
    let userLocation = getUserLocation();

    ponto = {
        "date": currentDate,
        "time": currentTime,
        "location": userLocation,
        "id": 2,
        "type": "saida"
    };
});

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