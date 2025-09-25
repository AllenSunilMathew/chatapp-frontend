import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

import {Provider} from 'react-redux'
import chatStore from './redux/store.js'

createRoot(document.getElementById('root')).render(

   <Provider store={chatStore}>
      <StrictMode>
        <App />
      </StrictMode>
   </Provider>

)
