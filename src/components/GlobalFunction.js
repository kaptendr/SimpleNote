const leadingZero = (val) => {
  const value = '' + val;
  let result = value;
  if (val < 10 && value.length < 2) {
    result = '0' + val;
  }

  return result;
}

const getFileName = () => {
  const date = new Date();
  const day = date.getFullYear() + '' + leadingZero(date.getMonth() + 1) + '' + leadingZero(date.getDate());
  const time = leadingZero(date.getHours()) + '' + leadingZero(date.getMinutes()) + '' + leadingZero(date.getSeconds());

  return 'notes_' + day + time;
}

export {
  leadingZero,
  getFileName,
}