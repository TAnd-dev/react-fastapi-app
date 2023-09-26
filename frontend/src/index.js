import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import { store } from './redux-store/store';
import { Provider } from 'react-redux';

import './css/app.css';

import App from './App';

const root = createRoot(document.getElementById('root'));
root.render(
    <StrictMode>
        <BrowserRouter>
            <Provider store={store}>
                <App />
            </Provider>
        </BrowserRouter>
    </StrictMode>
);
