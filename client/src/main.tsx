import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import App from './App'
import { initCapture } from './lib/capture'
import './index.css'

// Before the first render, so a visitor who lands and submits in one motion
// still arrives with the page they landed on recorded.
initCapture()

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
      <Toaster position="top-right" toastOptions={{ duration: 4000 }} />
    </BrowserRouter>
  </React.StrictMode>,
)
