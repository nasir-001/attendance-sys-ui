import { ref } from 'vue';
import dayjs from 'dayjs';
import CustomParseFormat from 'dayjs/plugin/CustomParseFormat';
import jwt_decode from 'jwt-decode';

function validateEmail (val) {
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@(([[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  return (re.test(val) || 'Please enter a valid email.')
}

function validatePhone (val) {
  const re = /^[0]\d{10}$/
  return (re.test(val) || 'Please enter a valid phone')
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
      (row.visitor[term] + '').toLowerCase().indexOf(terms[term].toLowerCase()) !== -1
    );
  };
  return rows;
};

function timeToReturn(time) {
  dayjs.extend(CustomParseFormat);
  time = dayjs(time).format('HH:mm:ss');
  return time
};

// function timeToReturn() {
//   const time = ref(new Date())
//   if(time.value.getHours() >= 12){
//     return time.value.getHours() + ":" + time.value.getMinutes() + "-pm";
//   } else {
//     return time.value.getHours() + ":" + time.value.getMinutes() + "-am";
//   };
// };


function  hasPermission (token, permission) {
  // eslint-disable-next-line
  const authPayload = jwt_decode(token)
  const hasperm = authPayload.data.permissions.indexOf(permission)
  return hasperm > -1
}


export {
  validateEmail,
  validatePhone,
  timeToReturn,
  getAvatarBackgroundColor,
  formatedDate,
  filterData,
  hasPermission
}