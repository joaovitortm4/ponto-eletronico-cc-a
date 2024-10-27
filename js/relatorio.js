document.addEventListener("DOMContentLoaded", () => {
  const recordsTableBody = document.querySelector("#records-table tbody");
  const justificativasTableBody = document.querySelector(
    "#justificativas-table tbody"
  );
  const filterPeriod = document.getElementById("filter-period");

  let records = JSON.parse(localStorage.getItem("registers")) || [];
  let justificativas = JSON.parse(localStorage.getItem("justificativas")) || [];

  function displayRecords(recordsToDisplay) {
    recordsTableBody.innerHTML = "";

    recordsToDisplay.forEach((record) => {
      const row = document.createElement("tr");

      if (record.isPastDate) {
        row.classList.add("past-record");
      }
      if (record.isEdited) {
        row.classList.add("edited-record");
      }
      if (record.note) {
        row.classList.add("noted-record");
      }

      row.innerHTML = `
                  <td>${record.date}</td>
                  <td>${record.time}</td>
                  <td>${record.type}</td>
                  <td>${record.note || ""}</td>
                  <td>
                      <button class="edit-record" data-id="${
                        record.id
                      }">Editar</button>
                      <button class="delete-record" data-id="${
                        record.id
                      }">Excluir</button>
                  </td>
              `;

      recordsTableBody.appendChild(row);
    });

    const editButtons = document.querySelectorAll(".edit-record");
    const deleteButtons = document.querySelectorAll(".delete-record");

    editButtons.forEach((button) => {
      button.addEventListener("click", openEditDialog);
    });

    deleteButtons.forEach((button) => {
      button.addEventListener("click", deleteRecord);
    });
  }

  function deleteRecord(event) {
    const recordId = event.target.getAttribute("data-id");
    const recordIndex = records.findIndex((record) => record.id === recordId);

    if (recordIndex !== -1) {
      const confirmDelete = confirm("Deseja realmente excluir este registro?");
      if (confirmDelete) {
        records.splice(recordIndex, 1);
        localStorage.setItem("registers", JSON.stringify(records));
        applyFilter();
      }
    }
  }

  function openEditDialog(event) {
    const recordId = event.target.getAttribute("data-id");
    const record = records.find((r) => r.id === recordId);

    if (record) {
      const dialog = document.getElementById("dialog-edit-register");
      const editDate = document.getElementById("edit-date");
      const editTime = document.getElementById("edit-time");
      const editType = document.getElementById("edit-type");
      const editNote = document.getElementById("edit-note");
      const btnSaveEdit = document.getElementById("btn-save-edit");
      const btnCancelEdit = document.getElementById("btn-cancel-edit");

      editDate.value = formatDateInput(parseDate(record.date));
      editTime.value = record.time;
      editType.value = record.type;
      editNote.value = record.note || "";

      function saveEdit() {
        const newDate = new Date(editDate.value);
        const now = new Date();

        if (newDate > now) {
          alert("Não é possível definir uma data futura.");
          return;
        }

        const today = new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate()
        );
        const selectedDate = new Date(
          newDate.getFullYear(),
          newDate.getMonth(),
          newDate.getDate()
        );
        record.isPastDate = selectedDate < today;

        record.date = formatDate(newDate);
        record.time = editTime.value;
        record.type = editType.value;
        record.note = editNote.value;
        record.isEdited = true;

        localStorage.setItem("registers", JSON.stringify(records));

        applyFilter();

        dialog.close();
      }

      btnSaveEdit.onclick = (e) => {
        e.preventDefault();
        saveEdit();
      };

      btnCancelEdit.onclick = () => {
        dialog.close();
      };

      dialog.showModal();
    }
  }

  function applyFilter() {
    const filterValue = filterPeriod.value;
    let filteredRecords = records;

    if (filterValue === "last-week") {
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

      filteredRecords = records.filter((record) => {
        const recordDate = parseDate(record.date);
        return recordDate >= oneWeekAgo;
      });
    } else if (filterValue === "last-month") {
      const oneMonthAgo = new Date();
      oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

      filteredRecords = records.filter((record) => {
        const recordDate = parseDate(record.date);
        return recordDate >= oneMonthAgo;
      });
    }

    filteredRecords.sort((a, b) => {
      const dateA = parseDateTime(a.date, a.time);
      const dateB = parseDateTime(b.date, b.time);
      return dateA - dateB;
    });

    displayRecords(filteredRecords);
  }

  function parseDate(dateString) {
    const [day, month, year] = dateString.split("/");
    return new Date(year, month - 1, day);
  }

  function parseDateTime(dateString, timeString) {
    const [day, month, year] = dateString.split("/");
    const [hours, minutes, seconds] = timeString.split(":");
    return new Date(year, month - 1, day, hours, minutes, seconds || 0);
  }

  function formatDate(date) {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }

  function formatDateInput(date) {
    return date.toISOString().split("T")[0];
  }

  function displayJustificativas() {
    justificativasTableBody.innerHTML = "";

    justificativas.forEach((justificativa) => {
      const row = document.createElement("tr");

      let arquivoLink = "";
      if (justificativa.arquivo) {
        arquivoLink = `<a href="${justificativa.arquivoUrl}" target="_blank">${justificativa.arquivo}</a>`;
      }

      row.innerHTML = `
                  <td>${justificativa.date}</td>
                  <td>${justificativa.justificativa}</td>
                  <td>${arquivoLink}</td>
              `;

      justificativasTableBody.appendChild(row);
    });
  }

  applyFilter();
  displayJustificativas();
});
