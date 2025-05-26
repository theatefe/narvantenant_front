export function normalize(text) {
  text = text.toUpperCase();
  text = text.replace(/ {5}/g, ' ');
  text = text.replace(/ {4}/g, ' ');
  text = text.replace(/ {3}/g, ' ');
  text = text.replace(/ {2}/g, ' ');
  text = text.replace(/ك/g, 'ک');
  text = text.replace(/ي/g, 'ی');
  text = text.replace(/,/g, '');
  text = text.replace(/،/g, '');
  text = text.replace(/#/g, '');
  text = text.replace(/@/g, '');
  text = text.replace(/$/g, '');
  text = text.replace(/!/g, '');
  text = text.replace(/&/g, '');
  text = text.replace('( ', '(');
  text = text.replace(' (', '(');
  text = text.replace(') ', ')');
  text = text.replace(' )', ')');
  text = text.replace('( ', '(');
  text = text.replace(' (', '(');
  text = text.replace(') ', ')');
  text = text.replace(' )', ')');
  text = text.replace(/؟/g, '');
  text = text.replace('?', '');
  text = text.replace('.', '');
  if (text.slice(-1) === ' ') {
    text = text.slice(0, -1);
  }
  return text;
}
