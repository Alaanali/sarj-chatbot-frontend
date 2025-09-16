import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import WeatherChatComponent from './WeatherChatComponent.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <WeatherChatComponent />
  </StrictMode>,
)
