import { EN_UN_NAME, FA_IR_NAME, LANGUAGE_LOCALSTORAGE_LABEL } from './Languages/Names';
import texts from './Languages/TextsOfMultipleLanguages.json';

export const giveTextBaseInput = (input) => {
  switch (localStorage.getItem(LANGUAGE_LOCALSTORAGE_LABEL)) {
    case FA_IR_NAME:
      return input[FA_IR_NAME];

    case EN_UN_NAME:
      return input[EN_UN_NAME];
  }
};

export const giveText = (inputIndex) => {
  switch (localStorage.getItem(LANGUAGE_LOCALSTORAGE_LABEL)) {
    case FA_IR_NAME:
      return texts[inputIndex]?.[FA_IR_NAME];

    case EN_UN_NAME:
      return texts[inputIndex]?.[EN_UN_NAME];
  }
};

export const giveDir = (reverse = false) => {
  let result = '';
  switch (localStorage.getItem(LANGUAGE_LOCALSTORAGE_LABEL)) {
    case FA_IR_NAME:
      result = 'rtl';
      break;

    case EN_UN_NAME:
      result = 'ltr';
      break;

    default:
      localStorage.setItem(LANGUAGE_LOCALSTORAGE_LABEL, FA_IR_NAME);
  }

  if (reverse) {
    if (result === 'ltr') return 'rtl';
    else return 'ltr';
  } else {
    return result;
  }
};

export const giveLang = () => {
  return localStorage.getItem(LANGUAGE_LOCALSTORAGE_LABEL);
};
