const generateSrn = (lastDigits) => {
  const srn = "PES120180";
  switch (lastDigits.toString().length) {
    case 1:
      return `${srn}000${lastDigits}`;
    case 2:
      return `${srn}00${lastDigits}`;
    case 3:
      return `${srn}0${lastDigits}`;
    case 4:
      return `${srn}${lastDigits}`;
    default:
      return srn;
  }
};

module.exports = generateSrn;
