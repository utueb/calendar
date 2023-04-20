const storedreminders = localStorage.getItem("calendar");
let reminders = storedreminders ? JSON.parse(storedreminders) : [];

//remove those that were long time in the past
const now = new Date();
const filteredreminders = reminders.filter((reminder) => {
  let reminderDate = createreminderDate(reminder);

  return now <= reminderDate;
});

reminders = filteredreminders;

//when time comes notify
window.setInterval(() => {
  const now = new Date();
  let nearestreminder = reminders[0];
  if (!nearestreminder) return;
  let reminderDate = createreminderDate(nearestreminder);
  if (`${reminderDate}` == `${now}`) notify();
}, 1000);

const notifyEL = document.getElementById("notify");
const notifyTitle = document.getElementById("notify-title");
const notifyLocation = document.getElementById("notify-location");
const notifyDescription = document.getElementById("notify-description");

function createreminderDate(reminder) {
  let yearAndMonth = reminder.month.split("-");
  let year = parseInt(yearAndMonth[0]);
  let month = parseInt(Number(yearAndMonth[1]) + 1);
  let day = reminder.date.day;
  let time = reminder.date.reminder.time;
  let reminderDate = new Date(`${year}-${month}-${day}-${time}`);

  return reminderDate;
}

function notify() {
  notifyEL.style.display = "block";
  notifyTitle.innerHTML = reminders[0].date.reminder.title;
  notifyLocation.innerHTML = reminders[0].date.reminder.location;
  notifyDescription.innerHTML = reminders[0].date.reminder.description;

  reminders.splice(0, 1);
  document.getElementById("notify-reminder-audio").play();
  renderCalendarForMonth(year, month);
}

document.getElementById("close-notification").addEventListener("click", () => {
  notifyEL.style.display = "none";
  notifyTitle.innerHTML = "";
  notifyLocation.innerHTML = "";
  notifyDescription.innerHTML = "";
});
