import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { GameContextProvider } from './context/GameContext.tsx'
import i18n from './locales/i18n.ts'
import { I18nextProvider } from 'react-i18next'
import { Analytics } from '@vercel/analytics/react'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <I18nextProvider i18n={i18n}>
      <GameContextProvider>
        <App />
        <Analytics />
      </GameContextProvider>
    </I18nextProvider>
  </React.StrictMode>,
)
