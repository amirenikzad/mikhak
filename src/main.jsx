import App from './App';
import { BrowserRouter } from 'react-router';
import { Provider } from 'react-redux';
import { store } from './store/store';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import './App.css';
import { registerSW } from 'virtual:pwa-register';
import { Provider as ChakraUIProvider } from './Components/ui/provider.jsx';
import { createRoot } from 'react-dom/client';

const container = document.getElementById('root');
const root = createRoot(container);
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 4,
      refetchOnWindowFocus: false,
    },
  },
});

root.render(
  <QueryClientProvider client={queryClient}>
    <Provider store={store}>
      <ChakraUIProvider>
        <BrowserRouter>
          {/*<StrictMode>*/}
          {/*<TourProvider>*/}
            <App />
          {/*</TourProvider>*/}
          {/*</StrictMode>*/}
        </BrowserRouter>
      </ChakraUIProvider>
    </Provider>
  </QueryClientProvider>
);

registerSW({ immediate: true });
