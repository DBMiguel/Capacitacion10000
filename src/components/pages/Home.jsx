import { Link } from 'react-router-dom'

export default function Home() {
  return (
    <div className="container">

      <h1>📱 Sistema de Evidencias</h1>

      <div className="menu">

        <Link to="/ubicacion" className="card">
          📍 Ubicación
        </Link>

        <Link to="/scanner" className="card">
          📄 Scanner
        </Link>

      </div>

    </div>
  )
}