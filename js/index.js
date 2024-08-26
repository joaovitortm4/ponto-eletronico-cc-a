const diaSemana = document.getElementById("dia-semana");
const dataAtual = document.getElementById("data-atual");
const horaAtual = document.getElementById("hora-atual");

diaSemana.textContent = getWeekDay();
dataAtual.textContent = getCurrenteDate();

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