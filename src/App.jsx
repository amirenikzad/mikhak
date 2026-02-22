import { lazy, useEffect } from 'react';
import { Box, LocaleProvider } from '@chakra-ui/react';
import { Fonts } from './Fonts';
import { Navigate, Route, Routes, useNavigate } from 'react-router';
import { ADMIN_ROUTE, AUTHENTICATION_ROUTE, LOGIN_ROUTE } from './Components/Base/BaseRouts';
import { EXPAND_NAME, FA_IR_NAME, LANGUAGE_LOCALSTORAGE_LABEL } from './Components/Base/MultiLanguages/Languages/Names';
import { BACKGROUND_DARK } from './Components/Base/BaseColor.jsx';
import { useDispatch } from 'react-redux';
import { setIsExpandedMenu } from './store/features/menuSlice.jsx';
import { Toaster } from './Components/ui/toaster.jsx';
import { giveDir } from './Components/Base/MultiLanguages/HandleLanguage.jsx';
import { scan } from 'react-scan';
import { setNavigator } from './navigateHelper.js';

const RouteAuthentication = lazy(() => import('./Components/Authentication/RouteAuthentication'));
const RouteAuthorization = lazy(() => import('./Components/Authorization/RouteAuthorization'));
const NotFound = lazy(() => import('./Components/Base/NotFound'));

function App() {
  const navigate = useNavigate();
  setNavigator(navigate);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!localStorage.getItem(LANGUAGE_LOCALSTORAGE_LABEL)) {
      localStorage.setItem(LANGUAGE_LOCALSTORAGE_LABEL, FA_IR_NAME);
    }
    if (localStorage.getItem(EXPAND_NAME) === 'false') {
      localStorage.setItem(EXPAND_NAME, 'false');
      dispatch(setIsExpandedMenu(false));
    } else {
      dispatch(setIsExpandedMenu(true));
    }
    document.getElementById('root').style.backgroundColor = BACKGROUND_DARK;
  }, []);

  scan({
    enabled: false,             // Enable or disable React Scan
    log: false,                // Log performance issues to the console
    renderThreshold: 5,        // Highlight components re-rendering more than 5 times
  });

  return (
    <LocaleProvider locale={giveDir() === 'rtl' ? 'ar' : 'en'} dir={giveDir()}>
      <Fonts />

      <Box H={'100dvh'} W={'100dvw'} dir={'ltr'} overflow={'hidden'}>
        <Routes>
          <Route path={'/'} element={<Navigate to={`${AUTHENTICATION_ROUTE}${LOGIN_ROUTE}`} />} />
          <Route path={AUTHENTICATION_ROUTE}>
            <Route path={'*'} element={<RouteAuthentication />} />
          </Route>
          <Route path={ADMIN_ROUTE}>
            <Route path={'*'} element={<RouteAuthorization />} />
          </Route>
          <Route path={'/not-found'} element={<NotFound />} />
          <Route path={'*'} element={<NotFound />} />
        </Routes>
      </Box>

      <Toaster />
    </LocaleProvider>
  );
}

export default App;
