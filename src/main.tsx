import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import { Auth0Provider } from '@auth0/auth0-react';
import { Provider } from 'react-redux';
import { store } from './redux/store.ts';

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
      {/* Envolvemos la aplicación en Provider y pasamos la tienda de Redux como prop */}
      <Auth0Provider domain="dev-txo0jpb5hw80bylr.us.auth0.com"
                     clientId="MoOscA1VTuRLgEhcLpxbZi4FkGAxcqd5"
                     authorizationParams={{
                         redirect_uri: 'http://localhost:5173/carrito/1'
                     }}>
          <Provider store={store}>
              <App /> {/* Renderizamos el componente principal de la aplicación */}
          </Provider>
      </Auth0Provider>

  </React.StrictMode>
);