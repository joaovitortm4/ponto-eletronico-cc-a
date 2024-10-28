document.addEventListener("DOMContentLoaded", () => {
  const recordsTableBody = document.querySelector("#records-table tbody");
  const justificativasTableBody = document.querySelector(
    "#justificativas-table tbody"
  );
  const filterPeriod = document.getElementById("filter-period");

  let records = JSON.parse(localStorage.getItem("registers")) || [];
  let justificativas = JSON.parse(localStorage.getItem("justificativas")) || [];

  records.forEach((record) => {
    if (!record.createdDate) {
      record.createdDate = record.date;
    }
  });

  localStorage.setItem("registers", JSON.stringify(records));

  records.forEach((record) => {
    const recordDate = parseDate(record.date);
    const createdDate = parseDate(record.createdDate);
    record.isPastDate = recordDate < createdDate;
  });

  function displayRecords(recordsToDisplay) {
    recordsTableBody.innerHTML = "";

    const recordsByDate = {};

    recordsToDisplay.forEach((record) => {
      if (!recordsByDate[record.date]) {
        recordsByDate[record.date] = [];
      }
      recordsByDate[record.date].push(record);
    });

    const sortedDates = Object.keys(recordsByDate).sort((a, b) => {
      const dateA = parseDate(a);
      const dateB = parseDate(b);
      return dateA - dateB;
    });

    sortedDates.forEach((date) => {
      const dateRow = document.createElement("tr");
      dateRow.classList.add("date-separator");
      dateRow.innerHTML = `
            <td colspan="5"><strong>${date}</strong></td>
        `;
      recordsTableBody.appendChild(dateRow);

      recordsByDate[date].forEach((record) => {
        const row = document.createElement("tr");

        let classes = [];
        if (record.isPastDate) classes.push("past-record");
        if (record.isEdited) classes.push("edited-record");
        if (record.note) classes.push("noted-record");
        row.className = classes.join(" ");

        row.innerHTML = `
              <td>${record.date}</td>
              <td>${record.time}</td>
              <td>${record.type}</td>
              <td>${record.note || ""}</td>
              <td class="actions">
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
    alert("O ponto não pode ser excluído.");
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

      const [day, month, year] = record.date.split("/");
      editDate.value = formatDateInput(new Date(year, month - 1, day));
      editTime.value = record.time;
      editType.value = record.type;
      editNote.value = record.note || "";

      function saveEdit() {
        const newDateValue = editDate.value;
        const newTimeValue = editTime.value;
        const newTypeValue = editType.value;
        const newNoteValue = editNote.value;

        const now = new Date();
        const [year, month, day] = newDateValue.split("-");
        const newDate = new Date(year, month - 1, day);

        if (newDate > now) {
          alert("Não é possível definir uma data futura.");
          return;
        }

        const selectedDate = new Date(
          newDate.getFullYear(),
          newDate.getMonth(),
          newDate.getDate()
        );
        const createdDate = parseDate(record.createdDate);

        record.isPastDate = selectedDate < createdDate;

        record.date = formatDate(newDate);
        record.time = newTimeValue;
        record.type = newTypeValue;
        record.note = newNoteValue;
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

  filterPeriod.addEventListener("change", applyFilter);

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
    if (!dateString) return null;
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
