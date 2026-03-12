import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { fetchBlueprint, updateBlueprint } from '../features/blueprints/blueprintsSlice.js'
import InteractiveCanvas from '../components/InteractiveCanvas.jsx'

export default function BlueprintDetailPage() {
  const { author, name } = useParams()
  const dispatch = useDispatch()
  const bp = useSelector((s) => s.blueprints.current)
  const { status, error } = useSelector((s) => s.blueprints)
  const [points, setPoints] = useState([])

  useEffect(() => {
    dispatch(fetchBlueprint({ author, name }))
  }, [author, name, dispatch])

  useEffect(() => {
    if (bp) setPoints(bp.points ?? [])
  }, [bp])

  const handlePointAdded = (newPoint) => {
    setPoints((prev) => [...prev, newPoint])
  }

  const handleSave = () => {
    dispatch(updateBlueprint({ author: bp.author, name: bp.name, points }))
    alert('Blueprint guardado')
  }

  const handleClear = () => setPoints([])

  if (!bp) return <div className="card"><p>Cargando...</p></div>

  return (
    <div className="card">
      <h2 style={{ marginTop: 0 }}>{bp.name}</h2>
      <p><strong>Autor:</strong> {bp.author}</p>
      <p><strong>Puntos:</strong> {points.length}</p>

      <InteractiveCanvas
        points={points}
        onPointAdded={handlePointAdded}
      />

      <div style={{ display: 'flex', gap: 12, marginTop: 12 }}>
        <button className="btn primary" onClick={handleSave} disabled={status === 'loading'}>
          Guardar
        </button>
        <button className="btn" onClick={handleClear}>
          Limpiar puntos
        </button>
      </div>

      {error && <p style={{ color: '#f87171', marginTop: 8 }}>⚠️ {error}</p>}
    </div>
  )
}