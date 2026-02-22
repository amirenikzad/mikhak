// navigateHelper.js
let navigate;

export const setNavigator = (navFunc) => {
  navigate = navFunc;
};

export const navigateTo = (path) => {
  if (navigate) {
    navigate(path);
  } else {
    // اگر هنوز navigate ست نشده بود، fallback
    window.location.replace(path);
  }
};
