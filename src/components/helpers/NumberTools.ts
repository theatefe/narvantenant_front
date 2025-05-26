export function FromInt(str) {
  str = str.replace(/0/g, '۰');
  str = str.replace(/1/g, '۱');
  str = str.replace(/2/g, '۲');
  str = str.replace(/3/g, '۳');
  str = str.replace(/4/g, '۴');
  str = str.replace(/5/g, '۵');
  str = str.replace(/6/g, '۶');
  str = str.replace(/7/g, '۷');
  str = str.replace(/8/g, '۸');
  str = str.replace(/9/g, '۹');
  return str;
}
export function ToInt(str) {
  str = str.replace(/٠/g, '0');
  str = str.replace(/١/g, '1');
  str = str.replace(/٢/g, '2');
  str = str.replace(/٣/g, '3');
  str = str.replace(/٤/g, '4');
  str = str.replace(/٥/g, '5');
  str = str.replace(/٦/g, '6');
  str = str.replace(/٧/g, '7');
  str = str.replace(/٨/g, '8');
  str = str.replace(/٩/g, '9');
  str = str.replace(/۰/g, '0');
  str = str.replace(/۱/g, '1');
  str = str.replace(/۲/g, '2');
  str = str.replace(/۳/g, '3');
  str = str.replace(/۴/g, '4');
  str = str.replace(/۵/g, '5');
  str = str.replace(/۶/g, '6');
  str = str.replace(/۷/g, '7');
  str = str.replace(/۸/g, '8');
  str = str.replace(/۹/g, '9');
  return str;
}
export function numberSpace(x) {
  if (x && x.toString().length > 0) {
    x = x.toString().replace(/,/g, ',');
    return FromInt(x.replace(/\B(?=(\d{3})+(?!\d))/g, ','));
  } else {
    return 0;
  }
}

export function validateMobile(mobile) {
  mobile = mobile.length <= 10 ? `0${mobile}` : mobile;
  if (
    (mobile.indexOf('+98') > -1 &&
      (mobile.length !== 13 ||
        !/^[0-9]+$/.test(mobile.substring(1, mobile.length)))) ||
    (mobile.indexOf('+98') === -1 &&
      (mobile.length !== 11 || !/^[0-9]+$/.test(mobile)))
  ) {
    return false;
  }
  if (
    (mobile.length === 13 && mobile.substring(0, 4) !== '+989') ||
    (mobile.length === 11 && mobile.substring(0, 2) !== '09')
  ) {
    return false;
  }
  mobile = mobile.replace('+989', '09');
  return mobile;
}
