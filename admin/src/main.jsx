import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'

import { Toaster } from 'sonner'
import store from './Redux/store.js'

ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <BrowserRouter>
      <App />
      <Toaster richColors position='bottom-right' toastOptions={{ duration: 1700 }} />
    </BrowserRouter>
  </Provider>
)