import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import { ListsProvider } from './context/ListsContext.jsx'
import { ConfirmProvider } from './context/ConfirmContext.jsx'
import { UsersProvider } from './context/UsersContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <UsersProvider>
        <ListsProvider>
          <ConfirmProvider>
            <App />
          </ConfirmProvider>
        </ListsProvider>
        </UsersProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
)

