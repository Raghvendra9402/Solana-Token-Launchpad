
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import Header from './component/Header.tsx'
import Footer from './component/Footer.tsx'

createRoot(document.getElementById('root')!).render(
 <> 
    <Header />
    <App />
    <Footer />
  </>
  
)
