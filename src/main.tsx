import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
// import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux';
import { store } from './redux/store.ts';
// import { Provider } from 'react-redux';
// import { store } from './redux/store.ts';

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
      {/* Envolvemos la aplicación en Provider y pasamos la tienda de Redux como prop */}
       <Provider store={store}>
        <App /> {/* Renderizamos el componente principal de la aplicación */}
      </Provider>
  </React.StrictMode>
);
