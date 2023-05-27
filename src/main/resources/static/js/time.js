
export function getFormattedTime(rawDate) {
  let parsed = new Date(rawDate);
  let date = parsed.getFullYear() + '-' + (parsed.getMonth() + 1) + '-' + parsed.getDate();
  let time = parsed.getHours() + ":" + addZeroIfNeeded(parsed.getMinutes()) + ":" + addZeroIfNeeded(parsed.getSeconds());
  return date + ' ' + time;
}

function addZeroIfNeeded(num) {
  if (num < 10) {
    num = "0" + num;
  }
  return num;
}
