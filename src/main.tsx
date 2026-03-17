import { createRoot } from 'react-dom/client'
import App from '@/App.tsx'
import './styles/App.css'
import { Provider } from 'react-redux'
import { store } from './store'

createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
    <App />
  </Provider>

)
