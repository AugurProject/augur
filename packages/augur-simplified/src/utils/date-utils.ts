const shortMonths = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sept',
  'Oct',
  'Nov',
  'Dec',
];

export const getDayFormat = (timestamp) => {
  if (!timestamp) return 'N/A';
  const inMilli = Number(timestamp) * 1000;
  const date = new Date(inMilli)
  const day = `0${date.getDate()}`.slice(-2);
  const mon = shortMonths[Number(date.getMonth())];
  return `${mon} ${day}`
}

export const getTimeFormat = (timestamp) => {
  if (!timestamp) return 'N/A';
  const inMilli = Number(timestamp) * 1000;
  const date = new Date(inMilli)
  const hours = `0${date.getHours()}`.slice(-2);
  const minutes = `0${Number(date.getMinutes())}`.slice(-2);
  return `${hours}:${minutes}`
}
