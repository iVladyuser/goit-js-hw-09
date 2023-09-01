import flatpickr from 'flatpickr';
// Додатковий імпорт стилів
import 'flatpickr/dist/flatpickr.min.css';
import { Report } from 'notiflix/build/notiflix-report-aio';

const startBtn = document.querySelector('[data-start]');
  
const input = document.querySelector('#datetime-picker');

const days = document.querySelector('[data-days]');
const hours = document.querySelector('[data-hours]');
const minutes = document.querySelector('[data-minutes]');
const seconds = document.querySelector('[data-seconds]');

const counters = { days, hours, minutes, seconds };

let remaindTime = 0;
 startBtn.disabled = true;

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
    onClose(selectedDates) {
    const date = Date.now();
    remaindTime = selectedDates[0].getTime() - date;
        if (remaindTime <= 0) {
       
      Report.failure(
        'Error',
        'Please choose a date in the future',
        'Come back'
      );
            startBtn.setAttribute('disabled', 'disabled');
            return;
    } else {
      startBtn.removeAttribute('disabled');
    }
  },
};
flatpickr(input, options);

function convertMs(ms) {
  // Number of milliseconds per unit of time
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  // Remaining days
  const days = Math.floor(ms / day);
  // Remaining hours
  const hours = Math.floor((ms % day) / hour);
  // Remaining minutes
  const minutes = Math.floor(((ms % day) % hour) / minute);
  // Remaining seconds
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}
function addLeadingZero(value) {
  return String(value).padStart(2, '0');
}
function initialValue(data) {
  const keys = Object.keys(data);

  for (const key of keys) {
    counters[key].textContent = addLeadingZero(data[key]);
  }
}
startBtn.addEventListener('click', () => {
  setInterval(() => {
    remaindTime -= 1000;
    if (remaindTime <= 0) {
      clearInterval();
      alert('time is over');
    } else {
  
      let dataDate = convertMs(remaindTime);
        initialValue(dataDate);
        startBtn.disabled = true;
    }
  }, 1000);
});
