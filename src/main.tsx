import * as React from 'react'
import ReactDOM from 'react-dom/client'
import Index from './index'
import './index.css'

const rootElement = document.getElementById('root')
if (!rootElement) throw new Error('Failed to find the root element')

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <Index />
  </React.StrictMode>
)
