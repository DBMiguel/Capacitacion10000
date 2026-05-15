import { useState, useEffect, useRef } from 'react'

export default function Ubicacion() {

  const [lat, setLat] = useState('')
  const [lng, setLng] = useState('')
  const [direccion, setDireccion] = useState('')
  const [precision, setPrecision] = useState('')
  const [foto, setFoto] = useState(null)
  const [imagenFinal, setImagenFinal] = useState(null)

  const canvasRef = useRef(null)

  // 📍 GPS seguro
  useEffect(() => {

    navigator.geolocation.watchPosition(
      async (pos) => {

        setLat(pos.coords.latitude)
        setLng(pos.coords.longitude)
        setPrecision(pos.coords.accuracy)

        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${pos.coords.latitude}&lon=${pos.coords.longitude}`
          )

          const data = await res.json()
          setDireccion(data.display_name || "Sin dirección")

        } catch {
          setDireccion("Ubicación no disponible")
        }

      },
      (err) => {
        console.log("GPS error", err)
      },
      {
        enableHighAccuracy: true,
        maximumAge: 0,
        timeout: 10000
      }
    )

  }, [])

  // 📸 FOTO
  const tomarFoto = (e) => {

    const file = e.target.files[0]
    if (!file) return

    const reader = new FileReader()

    reader.onload = (ev) => {
      setFoto(ev.target.result)
    }

    reader.readAsDataURL(file)
  }

  // 🧠 GENERAR IMAGEN FINAL (SEGURO)
  const generar = () => {

    if (!foto) {
      alert("Primero toma una foto")
      return
    }

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")

    const img = new Image()
    img.src = foto

    img.onload = () => {

      canvas.width = img.width
      canvas.height = img.height + 180

      ctx.drawImage(img, 0, 0)

      ctx.fillStyle = "rgba(0,0,0,0.7)"
      ctx.fillRect(0, img.height, canvas.width, 180)

      ctx.fillStyle = "white"
      ctx.font = "16px Arial"

      ctx.fillText("📍 EVIDENCIA DE UBICACIÓN", 10, img.height + 30)
      ctx.fillText(direccion, 10, img.height + 60)
      ctx.fillText(`Lat: ${lat}`, 10, img.height + 90)
      ctx.fillText(`Lng: ${lng}`, 10, img.height + 120)
      ctx.fillText(`Precisión: ${precision} m`, 10, img.height + 150)

      const final = canvas.toDataURL("image/png")
      setImagenFinal(final)
    }
  }

  // 📲 WHATSAPP
  const enviarWhatsApp = () => {

    const texto =
      `📍 EVIDENCIA DE UBICACIÓN\n` +
      `${direccion}\n` +
      `Lat: ${lat}\nLng: ${lng}\nPrecisión: ${precision} m`

    const url = `https://wa.me/?text=${encodeURIComponent(texto)}`
    window.open(url, "_blank")
  }

  return (
    <div className="container">

      <h2>📍 Evidencia de ubicación</h2>

      {/* 📸 FOTO */}
      <input
        type="file"
        accept="image/*"
        capture="environment"
        onChange={tomarFoto}
      />

      {/* BOTONES */}
      <div style={{ marginTop: 10 }}>
        <button onClick={generar}>
          Generar evidencia
        </button>

        <button onClick={enviarWhatsApp} disabled={!lat}>
          Enviar WhatsApp
        </button>
      </div>

      {/* INFO SIEMPRE VISIBLE */}
      <div className="gps" style={{ marginTop: 10 }}>
        <p>📍 {direccion}</p>
        <p>Lat: {lat}</p>
        <p>Lng: {lng}</p>
        <p>Precisión: {precision} m</p>
      </div>

      {/* IMAGEN FINAL */}
      {imagenFinal && (
        <div className="preview">
          <h3>📸 Evidencia generada</h3>
          <img src={imagenFinal} className="preview-img" />

        </div>
      )}

      {/* CANVAS OCULTO */}

      <canvas ref={canvasRef} style={{ display: "none" }} />

    </div>
  )
}