import { useMemo } from 'react';
import { EN_UN_NAME, FA_IR_NAME, LANGUAGE_LOCALSTORAGE_LABEL } from './MultiLanguages/Languages/Names.jsx';

export const Copyright = () => {
  return useMemo(() => {
    switch (localStorage.getItem(LANGUAGE_LOCALSTORAGE_LABEL)) {
      case FA_IR_NAME:
        return `کپی رایت © ${new Date().getFullYear()}، کلیه حقوق محفوظ است`

      case EN_UN_NAME:
        return `Copyright © ${new Date().getFullYear()}, All rights reserved`;
    }
  }, [])
}
