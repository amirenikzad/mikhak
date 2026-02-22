import { numberToLetterMethods } from '../BaseFunction.jsx';

export const numberToLetterPersian = (input) => {
  if (numberToLetterMethods(input)) {
    return "عدد باید بین ۱ تا ۱۰۰ میلیارد ریال باشد";
  }

  const persianNumbers = [
    '', 'یک', 'دو', 'سه', 'چهار', 'پنج', 'شش', 'هفت', 'هشت', 'نه',
    'ده', 'یازده', 'دوازده', 'سیزده', 'چهارده', 'پانزده', 'شانزده',
    'هفده', 'هجده', 'نوزده',
  ];
  const tens = [
    '', '', 'بیست', 'سی', 'چهل', 'پنجاه', 'شصت', 'هفتاد', 'هشتاد', 'نود',
  ];
  const hundreds = [
    '', 'صد', 'دویست', 'سیصد', 'چهارصد', 'پانصد', 'ششصد', 'هفتصد', 'هشتصد', 'نهصد',
  ];
  const scales = ['', 'هزار', 'میلیون', 'میلیارد', 'صد میلیارد'];

  function convertToWords(num) {
    let words = '';

    if (num >= 100) {
      const hundredsPart = Math.floor(num / 100);
      words += hundreds[hundredsPart];
      num %= 100;
      if (num > 0) words += ' و ';
    }

    if (num >= 20) {
      const tensPart = Math.floor(num / 10);
      words += tens[tensPart];
      num %= 10;
      if (num > 0) words += ' و ';
    }

    if (num > 0) {
      words += persianNumbers[num];
    }

    return words;
  }

  function splitIntoGroups(num) {
    const groups = [];
    while (num > 0) {
      groups.push(num % 1000);
      num = Math.floor(num / 1000);
    }
    return groups.reverse();
  }

  const groups = splitIntoGroups(input);
  let words = '';

  for (let i = 0; i < groups.length; i++) {
    if (groups[i] > 0) {
      if (words) words += ' و ';
      words += convertToWords(groups[i]) + (scales[groups.length - i - 1] ? ' ' + scales[groups.length - i - 1] : '');
    }
  }

  return `${words.trim()} ریال`;
};
