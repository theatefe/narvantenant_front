function padTo2Digits(num) {
  return num.toString().padStart(2, "0");
}

function formatDate(date) {
  date = new Date(date);
  return (
    [
      date.getFullYear(),
      padTo2Digits(date.getMonth() + 1),
      padTo2Digits(date.getDate()),
    ].join("-") +
    " " +
    [
      padTo2Digits(date.getHours()),
      padTo2Digits(date.getMinutes()),
      padTo2Digits(date.getSeconds()),
    ].join(":")
  );
}
export function defaultValueDate(date) {
  date = new Date(date);
  return [
    date.getFullYear(),
    padTo2Digits(date.getMonth() + 1),
    padTo2Digits(date.getDate()),
  ].join("-");
}
export function formatDate2(date) {
  date = new Date(date);
  return [
    date.getFullYear(),
    padTo2Digits(date.getMonth() + 1),
    padTo2Digits(date.getDate()),
  ].join(" ");
}

export function timeSince(date) {
  date = new Date(date);

  var seconds = Math.floor((+new Date() - date) / 1000);

  var interval = seconds / 31536000;

  if (interval > 1) {
    return Math.floor(interval) + " years";
  }
  interval = seconds / 2592000;
  if (interval > 1) {
    return Math.floor(interval) + " months";
  }
  interval = seconds / 86400;
  if (interval > 1) {
    return Math.floor(interval) + " days";
  }
  interval = seconds / 3600;
  if (interval > 1) {
    return Math.floor(interval) + " hours";
  }
  interval = seconds / 60;
  if (interval > 1) {
    return Math.floor(interval) + " minutes";
  }
  return Math.floor(seconds) + " seconds";
}
export function showdateTime(date) {
  
  date = new Date(date);
  const today = new Date();
  var seconds = Math.floor((+new Date() - date) / 1000);
  var interval = seconds / 86400;
  if (today.getDay() === date.getDay() && interval < 1) {
    return [
      padTo2Digits(date.getHours()),
      padTo2Digits(date.getMinutes()),
    ].join(":");
  }
  
  if (interval < 7) {
    return date.toLocaleString("default", { weekday: "long" });
  } else {
    return [
      date.getFullYear(),
      padTo2Digits(date.getMonth() + 1),
      padTo2Digits(date.getDate()),
    ].join("-");
  }
}
export function showTime(date) {
  date = new Date(date);
  return [padTo2Digits(date.getHours()), padTo2Digits(date.getMinutes())].join(
    ":"
  );
}
export function showDate(date) {
  date = new Date(date);
  // const monthNames = [
  //   "January",
  //   "February",
  //   "March",
  //   "April",
  //   "May",
  //   "June",
  //   "July",
  //   "August",
  //   "September",
  //   "October",
  //   "November",
  //   "December",
  // ];
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  return [
    date.getFullYear(),
    monthNames[date.getMonth()],
    padTo2Digits(date.getDate()),
  ].join(" ");
}
export function formatDateStartEnd(date) {
  date = new Date(date);
  return (
    [
      date.getFullYear().toString().slice(-2),
      padTo2Digits(date.getMonth() + 1),
      padTo2Digits(date.getDate()),
    ].join("-") +
    " " +
    [padTo2Digits(date.getHours()), padTo2Digits(date.getMinutes())].join(":")
  );
}
export function formatDateYear(date) {
  date = new Date(date);
  return [
    date.getFullYear().toString().slice(-2),
    padTo2Digits(date.getMonth() + 1),
    padTo2Digits(date.getDate()),
  ].join("-");
}
export default formatDate;
