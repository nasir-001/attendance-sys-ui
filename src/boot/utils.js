import { ref } from 'vue';
import dayjs from 'dayjs';
import CustomParseFormat from 'dayjs/plugin/CustomParseFormat';

function validateEmail (val) {
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@(([[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  return (re.test(val) || 'Please enter a valid email.')
}

const colors = [
  '#1abc9c',
  '#2ecc71',
  '#3498db',
  '#3498db',
  '#9b59b6',
  '#34495e',
  '#16a085',
  '#27ae60',
  '#2980b9',
  '#8e44ad',
  '#2c3e50',
];

function formatedDate(date) {
  dayjs.extend(CustomParseFormat);
  date = dayjs(date).format('DD-MMMM');
  return date;
}

function getAvatarBackgroundColor(username) {
  const index = username.length % colors.length;
  return colors[index];
};

function filterData(rows, terms) {
  for (const term in terms) {
    rows = rows.filter(row =>
      (row[term] + '').toLowerCase().indexOf(terms[term].toLowerCase()) !== -1
    );
  };
  return rows;
};

function timeToReturn() {
  const time = ref(new Date())
  if(time.value.getHours() >= 12){
    return time.value.getHours() + ":" + time.value.getMinutes() + "-pm";
  } else {
    return time.value.getHours() + ":" + time.value.getMinutes() + "-am";
  };
};

export {
  validateEmail,
  timeToReturn,
  getAvatarBackgroundColor,
  formatedDate,
  filterData
}