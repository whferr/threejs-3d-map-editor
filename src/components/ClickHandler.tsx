import { useThree } from '@react-three/fiber'
import { useMapStore } from '../store/mapStore'
import { screenToWorldPosition, snapToGrid } from '../utils/coordinates'

function ClickHandler() {
  const { camera, gl } = useThree()
  const { editorMode, selectedObjectType, addObject, mapData, selectObject } = useMapStore()

  const handleClick = (e: any) => {
    // If in select mode, deselect (object clicks will handle their own selection)
    if (editorMode === 'select') {
      selectObject(null)
      return
    }
    
    // Only place objects in place mode
    if (editorMode !== 'place') return

    // Find intersection point with existing objects
    const worldPosition = screenToWorldPosition(
      e.nativeEvent.clientX,
      e.nativeEvent.clientY,
      camera,
      gl.domElement
    )
    
    if (!worldPosition) return
    
    const snappedX = snapToGrid(worldPosition.x)
    const snappedZ = snapToGrid(worldPosition.z)
    
    // Find the highest object at this grid position
    let stackHeight = 0.5 // Default ground level
    
    mapData.objects.forEach(obj => {
      const objX = snapToGrid(obj.position[0])
      const objZ = snapToGrid(obj.position[2])
      
      if (objX === snappedX && objZ === snappedZ) {
        const objectTop = obj.position[1] + (obj.scale[1] / 2)
        stackHeight = Math.max(stackHeight, objectTop + 0.5) // 0.5 spacing
      }
    })

    // Create new object
    const newObject = {
      id: `${selectedObjectType}_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      type: selectedObjectType,
      position: [snappedX, stackHeight, snappedZ] as [number, number, number],
      rotation: [0, 0, 0] as [number, number, number],
      scale: [1, 1, 1] as [number, number, number],
      color: '#4a90e2',
      material: 'standard' as const,
      name: `${selectedObjectType}_${Date.now()}`
    }

    addObject(newObject)
  }

  return (
    <mesh
      position={[0, -0.01, 0]}
      onClick={handleClick}
      visible={false}
    >
      <planeGeometry args={[1000, 1000]} />
      <meshBasicMaterial transparent opacity={0} />
    </mesh>
  )
}

export default ClickHandler 