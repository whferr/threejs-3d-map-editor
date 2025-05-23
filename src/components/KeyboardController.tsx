import { useEffect } from 'react'
import { useMapStore } from '../store/mapStore'

function KeyboardController() {
  const { 
    setMoveModeActive, 
    editorMode, 
    selectedObjectId, 
    setEditorMode, 
    selectObject,
    removeObject 
  } = useMapStore()

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent shortcuts when typing in inputs
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return
      }

      switch (e.key.toLowerCase()) {
        case 'g': // Grab/Move mode (like Blender)
          if (editorMode === 'select' && selectedObjectId) {
            setMoveModeActive(true)
            e.preventDefault()
          }
          break
        
        case 'delete':
        case 'backspace':
        case 'x':
          // Delete selected object
          if (selectedObjectId) {
            removeObject(selectedObjectId)
            selectObject(null) // Deselect after deletion
            setMoveModeActive(false)
            e.preventDefault()
          }
          break
        
        case 'escape':
          // Cancel movement mode and deselect
          setMoveModeActive(false)
          selectObject(null)
          document.body.style.cursor = 'default'
          e.preventDefault()
          break
          
        case '1':
          setEditorMode('select')
          setMoveModeActive(false)
          e.preventDefault()
          break
          
        case '2':
          setEditorMode('place')
          setMoveModeActive(false)
          e.preventDefault()
          break
          
        case '3':
          setEditorMode('delete')
          setMoveModeActive(false)
          e.preventDefault()
          break
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [setMoveModeActive, editorMode, selectedObjectId, setEditorMode, selectObject, removeObject])

  return null // This component only handles events, no rendering
}

export default KeyboardController 