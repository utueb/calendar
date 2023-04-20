const remindersList = document.getElementById("reminders-list");
let clickedDay;

//open reminders container
document.getElementById("days").addEventListener("click", function (e) {
  closereminder();
  closereminderCreation();
  remindersList.innerHTML = "";
  if (e.target.children.length == 0 || e.target.classList.contains("past"))
    return clearreminderContainer();

  clickedDay = e.target.querySelector(".calendar-entry").innerHTML;
  reminderContainer.style.display = "block";
  for (const reminder of remindersThisMonth) {
    if (reminder.date.day == clickedDay) {
      const btn = document.createElement("BUTTON");
      const span = document.createElement("SPAN");
      const P = document.createElement("P");
      span.innerHTML = reminder.date.reminder.time;
      P.textContent = reminder.date.reminder.title;
      btn.appendChild(P);
      btn.appendChild(span);
      btn.dataset.reminderIndex = remindersThisMonth.indexOf(reminder);
      remindersList.append(btn);
    }
  }
});

//get info of the reminder

remindersList.addEventListener("click", function (e) {
  document.getElementById("reminder-viewing-container").style.display = "flex";

  const index = e.target.closest("button").dataset.reminderIndex;
  const reminder = remindersThisMonth[index].date.reminder;
  const title = reminder.title;
  const description = reminder.description;
  const location = reminder.location;
  const time = reminder.time;

  selectedreminder = [e.target.closest("button"), reminder];

  document.getElementById("reminder-title").innerHTML = title;
  document.getElementById("reminder-description").innerHTML = description;
  document.getElementById("reminder-location").innerHTML = location;
  document.getElementById("reminder-time").innerHTML = time;
});

document
  .getElementById("reminder-action-btns")
  .addEventListener("click", function (e) {
    const btnType = e.target.innerHTML;
    if (btnType == "delete") deletereminder();
    if (btnType == "close") closereminder();
  });

function deletereminder() {
  let indexOfreminderThisMonth = selectedreminder[0].dataset.reminderIndex;
  remindersThisMonth.splice(indexOfreminderThisMonth, 1);

  selectedreminder[0].remove();
  selectedreminder = undefined;

  const indexOfreminderOverall = getElementByMonthAndIndex(indexOfreminderThisMonth);

  reminders.splice(indexOfreminderOverall, 1);

  closereminder();

  renderCalendarForMonth(year, month);
}

document.getElementById("add-reminder").addEventListener("click", function (e) {
  document.getElementById("reminder-creating-container").style.display = "flex";
});

const reminderCreationCloseBtn = document.getElementById("reminder-create-btn-cancel");

reminderCreationCloseBtn.addEventListener("click", closereminderCreation);
const reminderCreationAddBtn = document.getElementById("reminder-create-btn-add");

reminderCreationAddBtn.addEventListener("click", addreminder);

function addreminder(e) {
  if (
    createreminderTitleInput.value != "" &&
    createreminderDescriptionInput.value != "" &&
    createreminderTimeInput.value != ""
  ) {
    let yearAndMonth = displayedMonth.split("-");
    let yearOfreminder = parseInt(yearAndMonth[0]);
    let monthOfreminder = parseInt(Number(yearAndMonth[1]) + 1);
    let reminderDate = new Date(
      `${yearOfreminder}-${monthOfreminder}-${clickedDay}-${createreminderTimeInput.value}`
    );
    if (reminderDate < new Date()) return;

    const reminder = {
      month: displayedMonth,
      date: {
        day: clickedDay,
        reminder: {
          title: createreminderTitleInput.value,
          description: createreminderDescriptionInput.value,
          location: createreminderLocationInput.value,
          time: createreminderTimeInput.value,
        },
      },
    };

    reminders.push(reminder);

    closereminderCreation();

    //sort reminders chronologically
    reminders.sort(function (a, b) {
      let aMonth = new Date(a.month + "-01");
      let bMonth = new Date(b.month + "-01");
      let aDay = a.date.day;
      let bDay = b.date.day;
      let aTime = new Date("1970-01-01T" + a.date.reminder.time + "Z");
      let bTime = new Date("1970-01-01T" + b.date.reminder.time + "Z");

      if (aMonth < bMonth) return -1;
      if (aMonth > bMonth) return 1;
      if (aDay < bDay) return -1;
      if (aDay > bDay) return 1;
      if (aTime < bTime) return -1;
      if (aTime > bTime) return 1;
    });

    renderCalendarForMonth(year, month);
  }
}
