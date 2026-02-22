import { setCaptchaImage, setId } from '../../store/features/captchaSlice';
import { giveDir, giveText } from './MultiLanguages/HandleLanguage';
import { fetchWithAxios } from './axios/FetchAxios.jsx';
import { toaster } from '../ui/toaster.jsx';

export const showToast = ({
                            title,
                            description,
                            status = 1,
                            positionIndex = 4,
                            duration = 3000,
                          }) => {
  toaster.create({
    type: ['success', 'error', 'warning', 'info'][status],
    title: title,
    description: description,
    duration: duration,
    dir: giveDir(),
  });
};

export const promiseToast = () => {
  return toaster.create({
    title: giveText(156),
    description: giveText(290),
    status: 'loading',
    type: 'loading',
  });
};

export const updatePromiseToastSuccessWarningInfo = ({ toastId, response, title }) => {
  toaster.update(toastId, {
    title: title,
    description: giveMessage(response.data.message),
    status: response.data.status,
    type: response.data.status,
  });
};

export const updatePromiseToastError = ({ toastId, error, title = giveText(287) }) => {
  toaster.update(toastId, {
    title: title,
    description: error.message,
    // description: error.detail.en,
    status: 'error',
    type: 'error',
  });
};

export const updatePromiseToastError2 = ({ toastId, error, title = giveText(287) }) => {
  toaster.update(toastId, {
    title: title,
    // description: error.fa,
    description: giveDir() === 'rtl' ? error?.fa : error?.en ,
    status: 'error',
    type: 'error',
  });
};

export const giveMeCaptcha = (dispatch) => {
  fetchWithAxios.get(`/captcha`).then(response => {
    dispatch(setCaptchaImage(response.data.image));
    dispatch(setId(response.data.id));
  });
};

export const validateEmail = (email) => {
  return !email.match(
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
  );
};

export const handleEnter = (event, buttonId) => {
  if (event.key === 'Enter') {
    event.preventDefault();
    document.getElementById(buttonId).click();
  }
};

export const statusIndex = (status) => {
  switch (status) {
    case 'success':
      return 0;
    case 'error':
      return 1;
    case 'warning':
      return 2;
    case 'info':
      return 3;
    default:
      return 3;
  }
};

export const checkStatus = ({ status }) => {
  if (status) {
    return status !== 'error' && status !== 'warning';
  }
};

export const logoutAxios = (message = giveText(74)) => {
  fetchWithAxios.post(`/logout`, {})
    .then(() => {
      window.location.href = '/auth/login';

      toaster.create({
        type: 'error',
        description: message,
        title: giveText(30),
        duration: 3000,
      });
    });
};

export const methodTagIconColor = (input, colorMode) => {
  const inp = input?.toString().toLowerCase();
  const is_dark = colorMode === 'dark';

  switch (inp) {
    case 'put':
      return is_dark ? '#b16403' : '#d5872b';
    case 'post':
      return is_dark ? '#164a31' : '#1f8a59';
    case 'get':
      return is_dark ? '#2465aa' : '#1775c8';
    case 'delete':
      return is_dark ? '#9c1313' : '#e12c2c';
    default:
      return is_dark ? 'gray' : 'gray.200';
  }
};

export const handleErrors = (form, setForm, inputFieldNames = [], invalidate = false) => {
  inputFieldNames.map((inputFieldName) => {
    setForm((prev) => ({
      ...prev,
      [inputFieldName]: {
        ...prev[inputFieldName],
        isInvalid: invalidate ? true : form[inputFieldName].value === '' || form[inputFieldName].value === [],
      },
    }));
  });
};

export const removeSelectedDropdownList = (event, the_key, setForm) => {
  if (event.key === 'Backspace') {
    setForm((prev) => ({
      ...prev, [the_key]: {
        value: '',
        isInvalid: prev.isInvalid,
      },
    }));
  }
};

export const hasPersianText = (text) => {
  const persianRegex = /[\u0600-\u06FF]/;
  return persianRegex.test(text);
};

export const checkEmailIsValid = ({ email, doIfValidate = () => null }) => {
  if (validateEmail(email)) {
    showToast({
      title: giveText(30),
      description: giveText(27),
      status: 2,
    });
    doIfValidate();
    return false;
  } else {
    return true;
  }
};

export const numberToLetterMethods = (value) => {
  return value < 1 || value > 100000000000;
};

export const commaForEvery3Digit = (input) => {
  return new Intl.NumberFormat('en-US').format(input);
};

export const giveTableRef = ({ listValue, value, index, ref }) => {
  return (index === listValue.length - 1 && listValue[listValue.length - 1] === value) ? ref : null;
};

export const colorPerDiscount = ({ discount, colorMode }) => {
  if (discount < 30) {
    return colorMode === 'light' ? '#248e40' : '#1b9e41';
  } else if (discount >= 30 && discount < 60) {
    return colorMode === 'light' ? '#c66536' : '#c66536';
  } else if (discount >= 61) {
    return colorMode === 'light' ? 'red' : 'red';
  }
};

export const giveMessage = (message) => {
  return giveDir() === 'rtl' ? message?.fa : message?.en;
};

export const changeLocation = () => {
  const host = window.location.hostname;
  const protocol = window.location.protocol;

  const parts = host.split('.');

  if (parts.length === 3) {
    const parts = host.split('.');
    const domain = parts.slice(-2).join('.');

    window.location.href = `${protocol}//${domain}${window.location.pathname}${window.location.search}`;
  }
};

export const convertDashToUnderline = (input) => {
  return input ? input.replaceAll('/', '_').replaceAll('\\', '_') : '';
};

export const convertFileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      const base64Result = reader.result; 
      const cleanBase64 = base64Result.split(',')[1]; 
      console.log('-cleanBase64:', cleanBase64);

      resolve(cleanBase64);
      // console.log('-now reader.result:', reader.result);
      // resolve(reader.result);
      
    };
    reader.onerror = reject;
  });
};

export const convertFileToBase642 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      // const base64Result = reader.result; 
      // const cleanBase64 = base64Result.split(',')[1]; 
      // console.log('-cleanBase64:', cleanBase64);

      // resolve(cleanBase64);
      console.log('-now reader.result:', reader.result);
      resolve(reader.result);
      
    };
    reader.onerror = reject;
  });
};

export const convertImageToBase64 = (imageSrc, saveIt) => {
  const img = new Image();
  img.src = imageSrc;
  img.crossOrigin = 'Anonymous';

  img.onload = () => {
    const canvas = document.createElement('canvas');
    canvas.width = img.width;
    canvas.height = img.height;

    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0);

    const dataURL = canvas.toDataURL('image/png');
    console.log('-now dataURL:', dataURL);
    saveIt(dataURL);

  };
};
