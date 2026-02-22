import { MENU_BACKGROUND_DARK } from './BaseColor.jsx';

export const selectStylesAddSection = ({ colorMode, borderRadius = '5px' }) => {
  return {
    control: (provided, state) => ({
      ...provided,
      borderRadius: borderRadius,
      borderWidth: state.isFocused ? 2 : 1,
      borderColor: state.isFocused ? '#3574e1' : 'gray.100',
      height: '40px',
      color: '#ffffff',
      backgroundColor: colorMode === 'light' ? 'white' : MENU_BACKGROUND_DARK,
      boxShadow: 'transparent',
      '&:hover': {
        boxShadow: 'transparent',
      },
    }),
    menuPortal: (provided) => ({
      ...provided,
      zIndex: '9999 !important', // Ensures dropdown appears above accordion
    }),
    menu: (provided) => ({
      ...provided,
      color: 'black',
      backgroundColor: 'black',
      marginTop: '2px',
      zIndex: '600 !important',
    }),
    input: (provided) => ({
      ...provided,
      width: '100%',
      color: colorMode === 'light' ? 'black' : 'white',
      cursor: 'text',
      minWidth: '130px',
    }),
    dropdownIndicator: (provided) => ({
      ...provided,
      color: colorMode === 'light' ? 'black' : 'white',
      '&:hover': {
        color: 'gray',
        cursor: 'pointer',
      },
    }),
    menuList: (provided) => ({
      ...provided,
      maxHeight: '180px',
      color: 'black',
      backgroundColor: colorMode === 'light' ? 'white' : MENU_BACKGROUND_DARK,
      zIndex: '99 !important',
    }),
    singleValue: (provided) => ({
      ...provided,
      color: colorMode === 'light' ? 'black' : 'white',
      fontWeight: 'normal',
    }),
    option: (provided) => ({
      ...provided,
      backgroundColor: colorMode === 'light' ? 'white' : MENU_BACKGROUND_DARK,
      color: colorMode === 'light' ? 'black' : 'white',
      '&:hover': {
        backgroundColor: 'lightblue',
        color: 'black',
        cursor: 'pointer',
      },
    }),
  };
};
