import { useMapStore } from '../store/mapStore'

function PropertiesPanel() {
  const {
    mapData,
    selectedObjectId,
    updateObject,
    updateEnvironment
  } = useMapStore()

  const selectedObject = mapData.objects.find(obj => obj.id === selectedObjectId)

  const updateObjectProperty = (property: string, value: any) => {
    if (!selectedObject) return
    updateObject(selectedObject.id, { [property]: value })
  }

  const updateVectorProperty = (property: string, index: number, value: number) => {
    if (!selectedObject) return
    const currentValue = selectedObject[property as keyof typeof selectedObject] as number[]
    const newValue = [...currentValue]
    newValue[index] = value
    updateObject(selectedObject.id, { [property]: newValue })
  }

  return (
    <div className="properties-panel">
      <h3>Properties</h3>
      
      {selectedObject ? (
        <div>
          <div className="property-group">
            <label>Object ID:</label>
            <div style={{ color: '#888', fontSize: '11px' }}>{selectedObject.id}</div>
          </div>

          <div className="property-group">
            <label>Type:</label>
            <select
              className="property-input"
              value={selectedObject.type}
              onChange={(e) => updateObjectProperty('type', e.target.value)}
            >
              <option value="cube">Cube</option>
              <option value="sphere">Sphere</option>
              <option value="cylinder">Cylinder</option>
              <option value="plane">Plane</option>
            </select>
          </div>

          <div className="property-group">
            <label>Position:</label>
            <div className="vector-input">
              <input
                type="number"
                step="0.1"
                value={selectedObject.position[0]}
                onChange={(e) => updateVectorProperty('position', 0, parseFloat(e.target.value))}
                className="property-input"
              />
              <input
                type="number"
                step="0.1"
                value={selectedObject.position[1]}
                onChange={(e) => updateVectorProperty('position', 1, parseFloat(e.target.value))}
                className="property-input"
              />
              <input
                type="number"
                step="0.1"
                value={selectedObject.position[2]}
                onChange={(e) => updateVectorProperty('position', 2, parseFloat(e.target.value))}
                className="property-input"
              />
            </div>
          </div>

          <div className="property-group">
            <label>Rotation:</label>
            <div className="vector-input">
              <input
                type="number"
                step="0.1"
                value={selectedObject.rotation[0]}
                onChange={(e) => updateVectorProperty('rotation', 0, parseFloat(e.target.value))}
                className="property-input"
              />
              <input
                type="number"
                step="0.1"
                value={selectedObject.rotation[1]}
                onChange={(e) => updateVectorProperty('rotation', 1, parseFloat(e.target.value))}
                className="property-input"
              />
              <input
                type="number"
                step="0.1"
                value={selectedObject.rotation[2]}
                onChange={(e) => updateVectorProperty('rotation', 2, parseFloat(e.target.value))}
                className="property-input"
              />
            </div>
          </div>

          <div className="property-group">
            <label>Scale:</label>
            <div className="vector-input">
              <input
                type="number"
                step="0.1"
                min="0.1"
                value={selectedObject.scale[0]}
                onChange={(e) => updateVectorProperty('scale', 0, parseFloat(e.target.value))}
                className="property-input"
              />
              <input
                type="number"
                step="0.1"
                min="0.1"
                value={selectedObject.scale[1]}
                onChange={(e) => updateVectorProperty('scale', 1, parseFloat(e.target.value))}
                className="property-input"
              />
              <input
                type="number"
                step="0.1"
                min="0.1"
                value={selectedObject.scale[2]}
                onChange={(e) => updateVectorProperty('scale', 2, parseFloat(e.target.value))}
                className="property-input"
              />
            </div>
          </div>

          <div className="property-group">
            <label>Color:</label>
            <input
              type="color"
              value={selectedObject.color}
              onChange={(e) => updateObjectProperty('color', e.target.value)}
              className="color-input"
            />
          </div>

          <div className="property-group">
            <label>Material:</label>
            <select
              className="property-input"
              value={selectedObject.material || 'standard'}
              onChange={(e) => updateObjectProperty('material', e.target.value)}
            >
              <option value="standard">Standard</option>
              <option value="basic">Basic</option>
              <option value="phong">Phong</option>
            </select>
          </div>
        </div>
      ) : (
        <div style={{ color: '#888', fontSize: '12px' }}>
          No object selected
        </div>
      )}

      <div style={{ marginTop: '24px', paddingTop: '16px', borderTop: '1px solid #444' }}>
        <h3>Environment</h3>
        
        <div className="property-group">
          <label>Background Color:</label>
          <input
            type="color"
            value={mapData.environment.backgroundColor}
            onChange={(e) => updateEnvironment({ backgroundColor: e.target.value })}
            className="color-input"
          />
        </div>

        <div className="property-group">
          <label>Ambient Light:</label>
          <input
            type="range"
            min="0"
            max="2"
            step="0.1"
            value={mapData.environment.ambientLight}
            onChange={(e) => updateEnvironment({ ambientLight: parseFloat(e.target.value) })}
            className="property-input"
          />
          <div style={{ fontSize: '11px', color: '#888' }}>
            {mapData.environment.ambientLight.toFixed(1)}
          </div>
        </div>

        <div className="property-group">
          <label>Directional Light Intensity:</label>
          <input
            type="range"
            min="0"
            max="3"
            step="0.1"
            value={mapData.environment.directionalLight.intensity}
            onChange={(e) => updateEnvironment({
              directionalLight: {
                ...mapData.environment.directionalLight,
                intensity: parseFloat(e.target.value)
              }
            })}
            className="property-input"
          />
          <div style={{ fontSize: '11px', color: '#888' }}>
            {mapData.environment.directionalLight.intensity.toFixed(1)}
          </div>
        </div>
      </div>
    </div>
  )
}

export default PropertiesPanel 