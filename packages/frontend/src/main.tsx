import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import GlobalScrollbar from './components/GlobalScrollbar/GlobalScrollbar'
import 'overlayscrollbars/styles/overlayscrollbars.css'
import './styles/global.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <GlobalScrollbar />
      <App />
    </BrowserRouter>
  </React.StrictMode>,
)
