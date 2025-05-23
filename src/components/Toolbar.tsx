import { useRef, useEffect, useState } from 'react'
import { useMapStore } from '../store/mapStore'

function Toolbar() {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const {
    editorMode,
    selectedObjectType,
    setEditorMode,
    setSelectedObjectType,
    clearMap,
    loadMap,
    exportMap,
    autoSave,
    mapData
  } = useMapStore()

  // Update last saved time when mapData changes
  useEffect(() => {
    setLastSaved(new Date())
  }, [mapData])

  const handleFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      try {
        const mapData = JSON.parse(event.target?.result as string)
        loadMap(mapData)
        alert('Map loaded successfully!')
      } catch (error) {
        alert('Error loading map file')
        console.error('Map loading error:', error)
      }
    }
    reader.readAsText(file)
  }

  const handleExport = () => {
    const mapJson = exportMap()
    const blob = new Blob([mapJson], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `map_${new Date().toISOString().slice(0, 10)}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleClear = () => {
    if (window.confirm('Are you sure you want to clear the entire map?')) {
      clearMap()
    }
  }

  const handleManualSave = () => {
    autoSave()
    setLastSaved(new Date())
    alert('Map saved to browser storage!')
  }

  const formatTime = (date: Date | null) => {
    if (!date) return 'Never'
    return date.toLocaleTimeString()
  }

  return (
    <div className="toolbar">
      <h3>Map Editor</h3>
      
      <div className="tool-section">
        <label>Editor Mode:</label>
        <div className="tool-buttons">
          <button
            className={`tool-button ${editorMode === 'select' ? 'active' : ''}`}
            onClick={() => setEditorMode('select')}
          >
            Select
          </button>
          <button
            className={`tool-button ${editorMode === 'place' ? 'active' : ''}`}
            onClick={() => setEditorMode('place')}
          >
            Place
          </button>
          <button
            className={`tool-button ${editorMode === 'delete' ? 'active' : ''}`}
            onClick={() => setEditorMode('delete')}
          >
            Delete
          </button>
        </div>
      </div>

      <div className="tool-section">
        <label>Object Type:</label>
        <div className="object-type-selector">
          <select
            value={selectedObjectType}
            onChange={(e) => setSelectedObjectType(e.target.value as any)}
          >
            <option value="cube">Cube</option>
            <option value="sphere">Sphere</option>
            <option value="cylinder">Cylinder</option>
            <option value="plane">Plane</option>
          </select>
        </div>
      </div>

      <div className="tool-section">
        <label>Autosave Status:</label>
        <div className="autosave-info">
          <span className="autosave-status">
            ✅ Auto-saving enabled
          </span>
          <span className="last-saved">
            Last saved: {formatTime(lastSaved)}
          </span>
          <button
            className="save-button"
            onClick={handleManualSave}
            title="Manually save to browser storage"
          >
            💾 Save Now
          </button>
        </div>
      </div>

      <div className="tool-section">
        <label>File Operations:</label>
        <div className="file-operations">
          <button
            className="file-button"
            onClick={() => fileInputRef.current?.click()}
          >
            Import Map
          </button>
          <button
            className="file-button"
            onClick={handleExport}
          >
            Export Map
          </button>
          <button
            className="file-button danger"
            onClick={handleClear}
          >
            Clear Map
          </button>
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        onChange={handleFileImport}
        style={{ display: 'none' }}
      />
    </div>
  )
}

export default Toolbar 