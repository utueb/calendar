//theme

const currentTheme = document.getElementById("current-theme");
const root = document.documentElement.style;

const storedTheme = localStorage.getItem("theme");
let theme = storedTheme ? JSON.parse(storedTheme) : 0;
if (theme) {
  const [brightness, r, g, b] = theme;
  root.setProperty("--R-value", r);
  root.setProperty("--G-value", g);
  root.setProperty("--B-value", b);
  if (brightness == "light") {
    currentTheme.style.background = "light";
    root.setProperty("--theme-background", "255, 255, 255");
    root.setProperty("--theme-text-border", "0, 0, 0");
  } else {
    currentTheme.style.background = "black";
    root.setProperty("--theme-background", "0, 0, 0");
    root.setProperty("--theme-text-border", "255, 255, 255");
  }
} else {
  root.setProperty("--R-value", 0);
  root.setProperty("--G-value", 90);
  root.setProperty("--B-value", 255);
}

document.addEventListener("DOMContentLoaded", function (e) {
  resizeElements();
  document.querySelectorAll(".theme:not(#current-theme)").forEach((theme) => {
    const themeData = theme.dataset.theme.split(",");
    const [r, g, b] = themeData[1].split("-");
    theme.style.borderColor = `rgb(${r},${g},${b})`;
  });
});

const themeSection = document.getElementById("theme-section");

themeSection.addEventListener("click", function (e) {
  e.target.classList.add("theme-active");
});

document
  .getElementById("available-themes")
  .addEventListener("click", function (e) {
    if (e.target.tagName == "DIV") {
      const [brightness, theme] = e.target.dataset.theme.split(",");
      const [r, g, b] = theme.split("-");
      root.setProperty("--R-value", r);
      root.setProperty("--G-value", g);
      root.setProperty("--B-value", b);
      localStorage.setItem("theme", JSON.stringify([brightness, r, g, b]));

      currentTheme.style.borderColor = `rgb(${r},${g},${b})`;

      if (brightness == "light") {
        currentTheme.style.background = "white";
        root.setProperty("--theme-background", "255, 255, 255");
        root.setProperty("--theme-text-border", "0, 0, 0");

        if (document.querySelector(".today"))
          document.querySelector(".today").style.setProperty("filter", "");
      } else {
        currentTheme.style.background = "black";
        root.setProperty("--theme-background", "0, 0, 0");
        root.setProperty("--theme-text-border", "255, 255, 255");

        if (document.querySelector(".today"))
          document
            .querySelector(".today")
            .style.setProperty("filter", "saturate(1.5)");
      }

      themeSection.classList.remove("theme-active");
    }
  });

let selectedreminder;
let remindersDisplayed = false;
const currentDate = new Date();
let month = currentDate.getMonth();
let year = currentDate.getFullYear();
const monthInput = document.getElementById("month");

monthInput.value = `${Number(year).toString().padStart(4, "0")}-${(
  Number(month) + 1
)
  .toString()
  .padStart(2, "0")}`;

//get the index of reminders array based on index of monthly array
function getElementByMonthAndIndex(index) {
  const startIndex = reminders.findIndex(
    (reminder) => reminder.month === displayedMonth
  );
  const reminderIndex = startIndex + Number(index);
  return reminderIndex;
}

//hide and clear reminder container
function clearreminderContainer() {
  reminderContainer.classList.add("reminder-container-hidden");
  const remindersList = document.querySelector("#reminders-list");
  remindersList.innerHTML = "";
}

//close reminder
function closereminder() {
  selectedreminder = undefined;
  document.getElementById("reminder-viewing-container").style.display = "none";
}

const createreminderTitleInput = document.getElementById(
  "create-reminder-title-input"
);
const createreminderDescriptionInput = document.getElementById(
  "create-reminder-description-input"
);
const createreminderTimeInput = document.getElementById(
  "create-reminder-time-input"
);
const createreminderLocationInput = document.getElementById(
  "create-reminder-location-input"
);

//clse reminder creation element
function closereminderCreation(e) {
  document.getElementById("reminder-creating-container").style.display = "none";
  createreminderTitleInput.value = "";
  createreminderDescriptionInput.value = "";
  createreminderTimeInput.value = "";
  createreminderLocationInput.value = "";
}

//return the index of the weekday
function dayOfWeekIndex(date) {
  const dayOfWeek = date.toLocaleDateString("en-US", { weekday: "long" });

  const dayIndex = [
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "sunday",
  ].indexOf(dayOfWeek.toLowerCase());

  return dayIndex;
}

//get week index
function getWeekIndex(year, month, day) {
  month += 1;
  const date = moment(`${year}-${month}-${day}`, "YYYY-MM-DD");
  return date.isoWeek();
}

//if there were days that couldnt be displayed last month, will be displayed this month
function renderLastMonth(year, month) {
  if (month == 0) {
    year--;
    month = 11;
  } else month--;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  let week = 0;

  let lastMonthExtraDays = [];

  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day);

    const dayOfWeekIndexValue = dayOfWeekIndex(date);

    if (dayOfWeekIndexValue == 0 && day != 1) week++;
    if (week == 5 && dayOfWeekIndexValue >= 0) lastMonthExtraDays.push(day);
  }
  return lastMonthExtraDays;
}

let displayedMonth;
let remindersThisMonth;
const dateDivs = [...document.querySelectorAll(".date")];
const reminderContainer = document.getElementById("reminder-container");

//display  month
function renderCalendarForMonth(year, month) {
  document.querySelector("title").textContent = `Calendar —— ${year}-${month
    .toString()
    .padStart(2, "0")}`;

  displayedMonth = `${year}-${month}`;
  remindersThisMonth = reminders.filter(
    (reminder) => reminder.month == displayedMonth
  );

  clearreminderContainer();
  closereminder();
  closereminderCreation();

  switch (month) {
    case 11:
    case 0:
    case 1:
      document.body.style.backgroundImage = "url(winter.webp)";

      break;
    case 2:
    case 3:
    case 4:
      document.body.style.backgroundImage = "url(spring.webp)";
      break;
    case 5:
    case 6:
    case 7:
      document.body.style.backgroundImage = "url(summer.webp)";

      break;
    case 8:
    case 9:
    case 10:
      document.body.style.backgroundImage = "url(autumn.webp)";
      break;
  }

  document.querySelectorAll(".calendar-entry").forEach((en) => {
    en.parentElement.classList.remove("last-month");
    en.remove();
  });

  document
    .querySelectorAll(".reminder-indicator")
    .forEach((reminder) => reminder.remove());

  const daysInMonth = new Date(year, month + 1, 0).getDate();

  let week = 0;

  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day);

    const dayOfWeekIndexValue = dayOfWeekIndex(date);

    const dayElem = document.createElement("p");
    dayElem.classList.add("calendar-entry");
    dayElem.innerText = day;

    if (dayOfWeekIndexValue == 0 && day != 1) week++;
    if (week == 5 && dayOfWeekIndexValue == 0) break;

    document.querySelectorAll("#week-number div")[week].innerHTML =
      getWeekIndex(year, month, day);

    let selectedDateBox =
      document.querySelectorAll(".date")[week * 7 + dayOfWeekIndexValue];
    selectedDateBox.appendChild(dayElem);

    const currentDate = new Date();
    const today = currentDate.getDate();

    dateDivs.forEach((div) =>
      div.children.length == 0 ? div.classList.remove("past") : 0
    );

    if (
      year < currentDate.getFullYear() ||
      (year == currentDate.getFullYear() && month < currentDate.getMonth())
    ) {
      selectedDateBox.classList.add("past");
    } else if (day < today && month == currentDate.getMonth()) {
      selectedDateBox.classList.add("past");
    } else selectedDateBox.classList.remove("past");

    if (
      currentDate.getMonth() === month &&
      currentDate.getFullYear() === year &&
      day == today
    ) {
      dayElem.parentElement.classList.add("today");
    } else {
      dayElem.parentElement.classList.remove("today");
    }

    for (const reminder of remindersThisMonth) {
      if (day == reminder.date.day) {
        if (selectedDateBox.querySelector(".reminder-indicator") == null) {
          const reminderIndicator = document.createElement("div");
          reminderIndicator.classList.add("reminder-indicator");
          reminderIndicator.innerHTML = reminder.date.reminder.title;
          selectedDateBox.append(reminderIndicator);
        }
      }
    }
  }

  const daysFromLastMonth = renderLastMonth(year, month);

  let nonEmptyFound = false;
  const emptyDateDivs = dateDivs.filter((dateDiv) => {
    const pElem = dateDiv.querySelector("p");
    if (nonEmptyFound || (pElem && pElem.textContent.trim() !== "")) {
      nonEmptyFound = true;
      return false;
    } else {
      return true;
    }
  });

  if (!daysFromLastMonth.length) return false;
  for (let i = 0; i < emptyDateDivs.length; i++) {
    const p = document.createElement("p");
    p.innerHTML = daysFromLastMonth[i];
    p.classList.add("calendar-entry");
    emptyDateDivs[i].append(p);
    emptyDateDivs[i].classList.add("last-month");
  }
}

//navigate through the months
document.querySelectorAll(".month-btn").forEach((btn) =>
  btn.addEventListener("click", function (e) {
    let click = e.target.id;
    if (click === "previous-month") {
      if (month == 0) {
        year--;
        month = 11;
      } else month--;

      monthInput.value = `${Number(year).toString().padStart(4, "0")}-${(
        Number(month) + 1
      )
        .toString()
        .padStart(2, "0")}`;
    }
    if (click === "next-month") {
      if (month == 11) {
        year++;
        month = 0;
      } else month++;
      monthInput.value = `${Number(year).toString().padStart(4, "0")}-${(
        Number(month) + 1
      )
        .toString()
        .padStart(2, "0")}`;
    }
    renderCalendarForMonth(year, month);
  })
);

document.getElementById("month").addEventListener("change", function (e) {
  const time = e.target.value.split("-");
  year = time[0];
  month = time[1] - 1;
  monthInput.value = `${Number(year).toString().padStart(4, "0")}-${Number(
    month + 1
  )
    .toString()
    .padStart(2, "0")}`;

  renderCalendarForMonth(year, month);
});

renderCalendarForMonth(year, month);

window.addEventListener("beforeunload", function (event) {
  localStorage.setItem("calendar", JSON.stringify(reminders));
});

// resize
const calendar = document.querySelector(".calendar");

// const calendarAspectRatio = calendar.offsetWidth / calendar.offsetHeight;
// const reminderContainerAspectRatio =
//   reminderContainer.offsetWidth / reminderContainer.offsetHeight;

const calendarAspectRatio = 2.0417827298050137;
const reminderContainerAspectRatio = 0.512;

window.addEventListener("resize", resizeElements);

function resizeElements() {
  const windowAspectRatio = window.innerWidth / window.innerHeight;

  let newCalendarWidth,
    newCalendarHeight,
    newReminderContainerWidth,
    newReminderContainerHeight;

  if (windowAspectRatio > calendarAspectRatio) {
    // Vertical resize
    newCalendarHeight = window.innerHeight * 0.8;
    newCalendarWidth = newCalendarHeight * calendarAspectRatio;

    newReminderContainerHeight = newCalendarHeight;
    newReminderContainerWidth =
      newReminderContainerHeight * reminderContainerAspectRatio;
  } else {
    // Horizontal resize
    newCalendarWidth = window.innerWidth * 0.8;
    newCalendarHeight = newCalendarWidth / calendarAspectRatio;

    newReminderContainerWidth =
      newCalendarHeight * reminderContainerAspectRatio;
    newReminderContainerHeight =
      newReminderContainerWidth / reminderContainerAspectRatio;
  }

  if (newReminderContainerHeight > window.innerHeight * 0.8) {
    newReminderContainerHeight = window.innerHeight * 0.8;
    newReminderContainerWidth =
      newReminderContainerHeight * reminderContainerAspectRatio;
  }

  calendar.style.width = newCalendarWidth + "px";
  calendar.style.height = newCalendarHeight + "px";

  reminderContainer.style.width = newReminderContainerWidth + "px";
  reminderContainer.style.height = newReminderContainerHeight + "px";
}
