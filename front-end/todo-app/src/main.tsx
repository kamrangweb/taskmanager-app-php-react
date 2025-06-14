import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { Provider } from 'react-redux';
import { store } from './store';

// container türü
type Container = HTMLElement;

// HTMLElement alınıyor
const element = document.getElementById('myElement');  // HTMLElement | null

// null kontrolü
if (element !== null) {
  const container: Container = element; // güvenle container'a atanabilir
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>,
);
