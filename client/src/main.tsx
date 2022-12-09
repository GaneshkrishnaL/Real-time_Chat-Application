import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './index.scss'

createRoot(document.querySelector('#root') as HTMLElement).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
)
