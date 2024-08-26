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
    return date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds ();
}

//retorna a data atual no padra dd/mm/aa
function getCurrenteDate(){
    const date = new Date();

    let mes = date.getMonth() +1;

    return date.getDate() + "/" + mes  + "/" + date.getFullYear ();
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