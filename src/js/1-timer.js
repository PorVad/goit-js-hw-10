
import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";

import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

const refs = {
  input: document.querySelector("#datetime-picker"),
  startBtn: document.querySelector("[data-start]"),
  days: document.querySelector("[data-days]"),
  hours: document.querySelector("[data-hours]"),
  minutes: document.querySelector("[data-minutes]"),
  seconds: document.querySelector("[data-seconds]"),
};

refs.startBtn.disabled = true;

let userSelectedDate = null;
let intervalId = null;

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    const pickedDate = selectedDates[0];
    if (!pickedDate || pickedDate <= Date.now()) {
      userSelectedDate = null;
      refs.startBtn.disabled = true;
      iziToast.error({
        title: "Error",
        message: "Please choose a date in the future",
      });
      return;
    }

    userSelectedDate = pickedDate;
    refs.startBtn.disabled = false;
  },
};

flatpickr(refs.input, options);

function convertMs(ms) {
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  const days = Math.floor(ms / day);
  const hours = Math.floor((ms % day) / hour);
  const minutes = Math.floor(((ms % day) % hour) / minute);
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}

function addLeadingZero(value) {
  return String(value).padStart(2, "0");
}

function updateTimerUi({ days, hours, minutes, seconds }) {
  refs.days.textContent = String(days);
  refs.hours.textContent = addLeadingZero(hours);
  refs.minutes.textContent = addLeadingZero(minutes);
  refs.seconds.textContent = addLeadingZero(seconds);
}

function stopTimer() {
  clearInterval(intervalId);
  intervalId = null;
  refs.input.disabled = false;
  refs.startBtn.disabled = true;
  iziToast.success({ title: "Done", message: "Countdown finished" });
}

refs.startBtn.addEventListener("click", () => {
  if (!userSelectedDate) return;

  if (intervalId !== null) return;

  refs.startBtn.disabled = true;
  refs.input.disabled = true;

  const tick = () => {
    const deltaMs = userSelectedDate - Date.now();
    if (deltaMs <= 0) {
      updateTimerUi({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      stopTimer();
      return;
    }

    const time = convertMs(deltaMs);
    updateTimerUi(time);
  };

  tick();
  intervalId = setInterval(tick, 1000);
});
