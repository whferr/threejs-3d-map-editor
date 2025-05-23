import * as THREE from 'three'

// Grid configuration
export const GRID_SIZE = 1 // 1 unit grid for simplicity
export const GRID_HALF = GRID_SIZE / 2

// Snap a single coordinate to grid
export function snapToGrid(value: number): number {
  return Math.round(value / GRID_SIZE) * GRID_SIZE
}

// Snap a 3D position to grid
export function snapPositionToGrid(position: [number, number, number]): [number, number, number] {
  return [
    snapToGrid(position[0]),
    position[1], // Don't snap Y to allow stacking
    snapToGrid(position[2])
  ]
}

// Convert screen coordinates to world position
export function screenToWorldPosition(
  clientX: number,
  clientY: number,
  camera: THREE.Camera,
  domElement: HTMLElement
): THREE.Vector3 | null {
  // Get normalized device coordinates
  const rect = domElement.getBoundingClientRect()
  const mouse = new THREE.Vector2(
    ((clientX - rect.left) / rect.width) * 2 - 1,
    -((clientY - rect.top) / rect.height) * 2 + 1
  )

  // Create raycaster
  const raycaster = new THREE.Raycaster()
  raycaster.setFromCamera(mouse, camera)

  // Intersect with ground plane (Y = 0)
  const groundPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0)
  const intersection = new THREE.Vector3()
  
  if (raycaster.ray.intersectPlane(groundPlane, intersection)) {
    return intersection
  }
  
  return null
}

// Calculate Y position for stacking objects
export function calculateStackingY(
  x: number, 
  z: number, 
  objects: Array<{ position: [number, number, number]; scale: [number, number, number] }>
): number {
  let maxY = 0
  
  // Find the highest object at this grid position
  objects.forEach(obj => {
    const objX = snapToGrid(obj.position[0])
    const objZ = snapToGrid(obj.position[2])
    
    if (objX === snapToGrid(x) && objZ === snapToGrid(z)) {
      const objectTop = obj.position[1] + (obj.scale[1] / 2)
      maxY = Math.max(maxY, objectTop)
    }
  })
  
  return maxY + GRID_HALF // Place on top with half-height offset
}

// Create a snapped position for new objects
export function createSnappedPosition(
  worldPosition: THREE.Vector3,
  existingObjects: Array<{ position: [number, number, number]; scale: [number, number, number] }>
): [number, number, number] {
  const snappedX = snapToGrid(worldPosition.x)
  const snappedZ = snapToGrid(worldPosition.z)
  const stackedY = calculateStackingY(snappedX, snappedZ, existingObjects)
  
  return [snappedX, stackedY, snappedZ]
} 