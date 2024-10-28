const diaSemana = document.getElementById("dia-semana");
const dataAtual = document.getElementById("data-atual");
const horaAtual = document.getElementById("hora-atual");

function updateDateTime() {
  const now = new Date();
  diaSemana.textContent = getWeekDay(now.getDay());
  dataAtual.textContent = formatDate(now);
  horaAtual.textContent = formatTime(now);
}

updateDateTime();
setInterval(updateDateTime, 1000);

function getWeekDay(dayIndex) {
  const dayNames = [
    "Domingo",
    "Segunda-feira",
    "Terça-feira",
    "Quarta-feira",
    "Quinta-feira",
    "Sexta-feira",
    "Sábado",
  ];
  return dayNames[dayIndex];
}

function formatDate(date) {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

function formatDateInput(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function formatTime(date) {
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");
  return `${hours}:${minutes}:${seconds}`;
}

const btnRegistrarPonto = document.getElementById("btn-registrar-ponto");
const dialogPonto = document.getElementById("dialog-ponto");
const dialogData = document.getElementById("dialog-data");
const dialogHora = document.getElementById("dialog-hora");
const dialogDateInput = document.getElementById("dialog-date");
const btnDialogRegister = document.getElementById("btn-dialog-register");
const btnDialogFechar = document.getElementById("dialog-fechar");
const selectRegisterType = document.getElementById("register-type");
const dialogNote = document.getElementById("dialog-note");

btnRegistrarPonto.addEventListener("click", openDialogPonto);

function openDialogPonto() {
  const now = new Date();
  dialogData.textContent = `Data: ${formatDate(now)}`;
  dialogHora.textContent = `Hora: ${formatTime(now)}`;
  dialogDateInput.value = formatDateInput(now);
  dialogDateInput.max = formatDateInput(now);
  dialogNote.value = "";
  dialogPonto.showModal();
}

btnDialogFechar.addEventListener("click", () => {
  dialogPonto.close();
});

btnDialogRegister.addEventListener("click", registerPonto);

function registerPonto(e) {
  e.preventDefault();
  const registerType = selectRegisterType.value;
  const selectedDateValue = dialogDateInput.value;
  const note = dialogNote.value;

  const now = new Date();
  const [year, month, day] = selectedDateValue.split("-");
  const selectedDate = new Date(Number(year), Number(month) - 1, Number(day));

  const nowDateOnly = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate()
  );
  const selectedDateOnly = new Date(
    selectedDate.getFullYear(),
    selectedDate.getMonth(),
    selectedDate.getDate()
  );

  if (selectedDateOnly > nowDateOnly) {
    showAlert("Não é possível registrar uma data futura.", true);
    return;
  }

  const createdDate = formatDate(nowDateOnly);

  const time = formatTime(now);

  getUserLocation()
    .then((location) => {
      const ponto = {
        id: generateId(),
        date: formatDate(selectedDateOnly),
        time: time,
        type: registerType,
        note: note,
        location: location,
        isPastDate: selectedDateOnly < nowDateOnly,
        isEdited: false,
        createdDate: createdDate,
      };

      saveRegister(ponto);
      showAlert("Ponto registrado com sucesso!");

      dialogPonto.close();
    })
    .catch((error) => {
      console.error(error);
      showAlert("Erro ao obter a localização.", true);
    });
}

const btnJustificarAusencia = document.getElementById(
  "btn-justificar-ausencia"
);
const dialogJustificativa = document.getElementById("dialog-justificativa");
const justificativaDataInput = document.getElementById("justificativa-data");
const justificativaTexto = document.getElementById("justificativa-texto");
const justificativaArquivo = document.getElementById("justificativa-arquivo");
const btnEnviarJustificativa = document.getElementById(
  "btn-enviar-justificativa"
);
const btnDialogJustificativaFechar = document.getElementById(
  "dialog-justificativa-fechar"
);

btnJustificarAusencia.addEventListener("click", openDialogJustificativa);

function openDialogJustificativa() {
  const now = new Date();
  justificativaDataInput.value = formatDateInput(now);
  justificativaDataInput.max = formatDateInput(now);
  justificativaTexto.value = "";
  justificativaArquivo.value = "";
  dialogJustificativa.showModal();
}

btnDialogJustificativaFechar.addEventListener("click", () => {
  dialogJustificativa.close();
});

btnEnviarJustificativa.addEventListener("click", enviarJustificativa);

function enviarJustificativa(e) {
  e.preventDefault();
  const selectedDate = justificativaDataInput.value;
  const justificativa = justificativaTexto.value;
  const arquivo = justificativaArquivo.files[0];

  const now = new Date();
  const [year, month, day] = selectedDate.split("-");
  const date = new Date(year, month - 1, day);
  if (date > now) {
    showAlert("Não é possível justificar uma data futura.", true);
    return;
  }

  let arquivoNome = null;
  let arquivoUrl = null;

  if (arquivo) {
    arquivoNome = arquivo.name;
    arquivoUrl = URL.createObjectURL(arquivo);
  }

  const justificativaObj = {
    id: generateId(),
    date: formatDate(date),
    justificativa: justificativa,
    arquivo: arquivoNome,
    arquivoUrl: arquivoUrl,
  };
  saveJustificativa(justificativaObj);

  showAlert("Justificativa registrada com sucesso!");

  dialogJustificativa.close();
}

function getUserLocation() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject("Geolocalização não é suportada pelo seu navegador");
    } else {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        () => {
          reject("Não foi possível obter a localização");
        }
      );
    }
  });
}

function generateId() {
  return "_" + Math.random().toString(36).substr(2, 9);
}

function saveRegister(register) {
  let registers = JSON.parse(localStorage.getItem("registers")) || [];
  registers.push(register);
  localStorage.setItem("registers", JSON.stringify(registers));
}

function saveJustificativa(justificativa) {
  let justificativas = JSON.parse(localStorage.getItem("justificativas")) || [];
  justificativas.push(justificativa);
  localStorage.setItem("justificativas", JSON.stringify(justificativas));
}

function showAlert(message, isError = false) {
  const alerta = document.getElementById("alerta-ponto-registrado");
  alerta.querySelector("p").textContent = message;
  if (isError) {
    alerta.classList.add("error");
  } else {
    alerta.classList.remove("error");
  }
  alerta.classList.remove("hidden");
  setTimeout(() => {
    alerta.classList.add("hidden");
  }, 3000);
}
