import { useMapStore } from '../store/mapStore'

function StatusBar() {
  const { editorMode, selectedObjectId, isMoveModeActive, mapData } = useMapStore()
  
  const selectedObject = mapData.objects.find(obj => obj.id === selectedObjectId)
  
  const getModeText = () => {
    if (isMoveModeActive) return 'MOVE MODE - Drag to move horizontally, Shift+Drag for vertical'
    switch (editorMode) {
      case 'select': return 'SELECT MODE - Click objects to select'
      case 'place': return 'PLACE MODE - Click to place objects (stacks automatically)'
      case 'delete': return 'DELETE MODE - Click objects to delete'
      default: return ''
    }
  }

  return (
    <div className="status-bar">
      <div className="status-left">
        <span className="mode-indicator">{getModeText()}</span>
        {selectedObject && (
          <span className="selected-object">
            Selected: {selectedObject.name || selectedObject.type}
          </span>
        )}
      </div>
      
      <div className="status-right">
        <div className="keyboard-shortcuts">
          {editorMode === 'select' && selectedObjectId && (
            <span className="shortcut">
              <kbd>G</kbd> Move object
            </span>
          )}
          {selectedObjectId && (
            <span className="shortcut">
              <kbd>Del</kbd> Delete object
            </span>
          )}
          {isMoveModeActive && (
            <span className="shortcut">
              <kbd>Shift</kbd>+Drag for vertical
            </span>
          )}
          <span className="shortcut">
            <kbd>1</kbd> Select
          </span>
          <span className="shortcut">
            <kbd>2</kbd> Place
          </span>
          <span className="shortcut">
            <kbd>3</kbd> Delete
          </span>
          <span className="shortcut">
            <kbd>Esc</kbd> Cancel
          </span>
        </div>
      </div>
    </div>
  )
}

export default StatusBar 