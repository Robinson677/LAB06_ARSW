import { useState } from 'react'

export default function BlueprintForm({ onSubmit }) {
  const [author, setAuthor] = useState('')
  const [name, setName] = useState('')
  const [pointsJSON, setPointsJSON] = useState('[{"x":10,"y":10},{"x":40,"y":60}]')

  const handle = (e) => {
    e.preventDefault()
    try {
      const points = JSON.parse(pointsJSON)
      onSubmit({ author, name, points })
    } catch (err) {
      alert('JSON de puntos inválido')
    }
  }

  return (
    <form onSubmit={handle} className="card">
      <h3 style={{ marginTop: 0 }}>Crear Blueprint</h3>
      
      <div className="grid cols-2">
        <div>
          <label htmlFor="author-input">Autor</label>
          <input
            id="author-input"
            className="input"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            placeholder="juan.perez"
          />
        </div>
        <div>
          <label htmlFor="name-input">Nombre</label>
          <input
            id="name-input"
            className="input"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="mi-dibujo"
          />
        </div>
      </div>

      <div style={{ marginTop: 12 }}>
        <label htmlFor="points-input">Puntos (JSON)</label>
        <textarea
          id="points-input"
          className="input"
          rows="5"
          value={pointsJSON}
          onChange={(e) => setPointsJSON(e.target.value)}
        />
      </div>

      <div style={{ marginTop: 12 }}>
        <button type="submit" className="btn primary">Guardar</button>
      </div>
    </form>
  )
}