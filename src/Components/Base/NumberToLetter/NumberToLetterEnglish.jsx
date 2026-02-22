import { numberToLetterMethods } from '../BaseFunction.jsx';

export const numberToLetterEnglish = (number) => {
  if (numberToLetterMethods(number)) {
    return 'The number must be between 1 and 100 billion.';
  }

  const englishNumbers = [
    '', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine',
    'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen',
    'seventeen', 'eighteen', 'nineteen',
  ];
  const tens = [
    '', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety',
  ];
  const hundreds = [
    '', 'one hundred', 'two hundred', 'three hundred', 'four hundred', 'five hundred',
    'six hundred', 'seven hundred', 'eight hundred', 'nine hundred',
  ];
  const scales = ['', 'thousand', 'million', 'billion', 'hundred billion'];

  function convertToWords(num) {
    let words = '';

    if (num >= 100) {
      const hundredsPart = Math.floor(num / 100);
      words += hundreds[hundredsPart];
      num %= 100;
      if (num > 0) words += ' and ';
    }

    if (num >= 20) {
      const tensPart = Math.floor(num / 10);
      words += tens[tensPart];
      num %= 10;
      if (num > 0) words += '-';
    }

    if (num > 0) {
      words += englishNumbers[num];
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

  const groups = splitIntoGroups(number);
  let words = '';

  for (let i = 0; i < groups.length; i++) {
    if (groups[i] > 0) {
      if (words) words += ', ';
      words += convertToWords(groups[i]) + (scales[groups.length - i - 1] ? ' ' + scales[groups.length - i - 1] : '');
    }
  }

  return `${words.trim()} Rial`;
};
