import { Routes, Route } from 'react-router-dom'
import Home from './components/pages/Home'
import Ubicacion from './components/pages/Ubicacion'
import Scanner from './components/pages/Scanner'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/ubicacion" element={<Ubicacion />} />
      <Route path="/scanner" element={<Scanner />} />
    </Routes>
  )
}

export default App