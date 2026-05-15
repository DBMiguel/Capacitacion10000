import { useState } from 'react'
import { Link } from 'react-router-dom'
import jsPDF from 'jspdf'
import JSZip from 'jszip'

function Scanner() {

  const [imagenes, setImagenes] = useState([])

  const cargar = (e) => {
    const files = Array.from(e.target.files)

    files.forEach(file => {
      const reader = new FileReader()
      reader.onload = (ev) => {
        setImagenes(prev => [...prev, ev.target.result])
      }
      reader.readAsDataURL(file)
    })
  }

  const pdf = () => {
    const doc = new jsPDF()

    imagenes.forEach((img, i) => {
      if (i > 0) doc.addPage()
      doc.addImage(img, 'JPEG', 10, 10, 190, 250)
    })

    doc.save("documentos.pdf")
  }

  const zip = async () => {
    const z = new JSZip()

    imagenes.forEach((img, i) => {
      z.file(`doc${i}.jpg`, img.split(',')[1], { base64: true })
    })

    const blob = await z.generateAsync({ type: 'blob' })

    const a = document.createElement("a")
    a.href = URL.createObjectURL(blob)
    a.download = "docs.zip"
    a.click()
  }

  return (
    <div className="container">

      <Link to="/">⬅ Volver</Link>

      <h1>📄 Scanner</h1>

      <input type="file" multiple accept="image/*" onChange={cargar} />

      <div className="grid">
        {imagenes.map((img, i) => (
          <img key={i} src={img} width="120" />
        ))}
      </div>

      <button onClick={pdf}>PDF</button>
      <button onClick={zip}>ZIP</button>

    </div>
  )
}

export default Scanner