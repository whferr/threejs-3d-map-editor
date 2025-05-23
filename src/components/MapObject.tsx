import { useRef, useState, useEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { useMapStore, MapObject as MapObjectType } from '../store/mapStore'
import { snapPositionToGrid, screenToWorldPosition } from '../utils/coordinates'

interface MapObjectProps {
  object: MapObjectType
}

function MapObject({ object }: MapObjectProps) {
  const meshRef = useRef<THREE.Mesh>(null)
  const [hovered, setHovered] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const { camera, gl } = useThree()
  const { 
    selectedObjectId, 
    selectObject, 
    editorMode, 
    updateObject, 
    removeObject,
    isMoveModeActive
  } = useMapStore()
  
  const isSelected = selectedObjectId === object.id

  const handlePointerDown = (e: any) => {
    e.stopPropagation()
    e.nativeEvent.stopImmediatePropagation()
    
    if (editorMode === 'select') {
      // Always select the object when clicked
      selectObject(object.id)
      
      // If move mode is active, start dragging this object immediately
      if (isMoveModeActive) {
        setIsDragging(true)
        document.body.style.cursor = 'grabbing'
      }
    } else if (editorMode === 'delete') {
      removeObject(object.id)
    }
  }

  const handleClick = (e: any) => {
    e.stopPropagation()
    e.nativeEvent.stopImmediatePropagation()
    
    // Ensure selection happens on click as well
    if (editorMode === 'select') {
      selectObject(object.id)
    }
  }

  const handlePointerMove = (e: any) => {
    // Only allow movement when actively dragging
    if (!isDragging || editorMode !== 'select') return
    
    // Get the current mouse position in screen space
    const rect = gl.domElement.getBoundingClientRect()
    const mouseX = ((e.nativeEvent.clientX - rect.left) / rect.width) * 2 - 1
    const mouseY = -((e.nativeEvent.clientY - rect.top) / rect.height) * 2 + 1
    
    // Create a raycaster from the mouse position
    const raycaster = new THREE.Raycaster()
    raycaster.setFromCamera(new THREE.Vector2(mouseX, mouseY), camera)
    
    // Check for modifier keys to determine movement mode
    const isShiftPressed = e.nativeEvent.shiftKey
    
    if (isShiftPressed) {
      // Shift + drag = vertical movement only
      const verticalPlane = new THREE.Plane(new THREE.Vector3(1, 0, 0), -object.position[0])
      const intersectionPoint = new THREE.Vector3()
      
      if (raycaster.ray.intersectPlane(verticalPlane, intersectionPoint)) {
        const snappedPosition = snapPositionToGrid([
          object.position[0], // Keep X
          Math.max(0.5, intersectionPoint.y), // Allow Y movement, minimum 0.5
          object.position[2]  // Keep Z
        ])
        
        updateObject(object.id, { position: snappedPosition })
      }
    } else {
      // Normal drag = horizontal movement
      const dragPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), -object.position[1])
      const intersectionPoint = new THREE.Vector3()
      
      // Find where the ray intersects with our drag plane
      if (raycaster.ray.intersectPlane(dragPlane, intersectionPoint)) {
        const snappedPosition = snapPositionToGrid([
          intersectionPoint.x,
          object.position[1], // Keep Y
          intersectionPoint.z
        ])
        
        updateObject(object.id, { position: snappedPosition })
      }
    }
  }

  const handlePointerUp = (e: any) => {
    if (isDragging) {
      setIsDragging(false)
      document.body.style.cursor = 'default'
    }
  }

  // Handle move mode activation/deactivation
  useEffect(() => {
    if (isSelected && isMoveModeActive && !isDragging) {
      // If this object is selected and move mode just activated, prepare for dragging
      document.body.style.cursor = 'grabbing'
    } else if (isSelected && !isMoveModeActive && isDragging) {
      // If move mode was deactivated while dragging, stop dragging
      setIsDragging(false)
      document.body.style.cursor = 'default'
    }
  }, [isSelected, isMoveModeActive, isDragging])

  // Global event handlers for when dragging outside the object
  useEffect(() => {
    const handleGlobalPointerMove = (e: PointerEvent) => {
      if (!isDragging || editorMode !== 'select') return
      
      // Get the current mouse position in screen space
      const rect = gl.domElement.getBoundingClientRect()
      const mouseX = ((e.clientX - rect.left) / rect.width) * 2 - 1
      const mouseY = -((e.clientY - rect.top) / rect.height) * 2 + 1
      
      // Create a raycaster from the mouse position
      const raycaster = new THREE.Raycaster()
      raycaster.setFromCamera(new THREE.Vector2(mouseX, mouseY), camera)
      
      // Check for modifier keys to determine movement mode
      const isShiftPressed = e.shiftKey
      
      if (isShiftPressed) {
        // Shift + drag = vertical movement only
        const verticalPlane = new THREE.Plane(new THREE.Vector3(1, 0, 0), -object.position[0])
        const intersectionPoint = new THREE.Vector3()
        
        if (raycaster.ray.intersectPlane(verticalPlane, intersectionPoint)) {
          const snappedPosition = snapPositionToGrid([
            object.position[0], // Keep X
            Math.max(0.5, intersectionPoint.y), // Allow Y movement, minimum 0.5
            object.position[2]  // Keep Z
          ])
          
          updateObject(object.id, { position: snappedPosition })
        }
      } else {
        // Normal drag = horizontal movement
        const dragPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), -object.position[1])
        const intersectionPoint = new THREE.Vector3()
        
        if (raycaster.ray.intersectPlane(dragPlane, intersectionPoint)) {
          const snappedPosition = snapPositionToGrid([
            intersectionPoint.x,
            object.position[1], // Keep Y
            intersectionPoint.z
          ])
          
          updateObject(object.id, { position: snappedPosition })
        }
      }
    }

    const handleGlobalPointerUp = () => {
      if (isDragging) {
        setIsDragging(false)
        document.body.style.cursor = 'default'
      }
    }

    if (isDragging) {
      document.addEventListener('pointermove', handleGlobalPointerMove)
      document.addEventListener('pointerup', handleGlobalPointerUp)
      
      return () => {
        document.removeEventListener('pointermove', handleGlobalPointerMove)
        document.removeEventListener('pointerup', handleGlobalPointerUp)
      }
    }
  }, [isDragging, camera, gl.domElement, object.position, updateObject, object.id, editorMode])

  // Update mesh transform
  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.position.set(...object.position)
      meshRef.current.rotation.set(...object.rotation)
      meshRef.current.scale.set(...object.scale)
    }
  })

  // Render geometry based on type
  const renderGeometry = () => {
    switch (object.type) {
      case 'cube':
        return <boxGeometry args={[1, 1, 1]} />
      case 'sphere':
        return <sphereGeometry args={[0.5, 32, 16]} />
      case 'cylinder':
        return <cylinderGeometry args={[0.5, 0.5, 1, 32]} />
      case 'plane':
        return <planeGeometry args={[1, 1]} />
      default:
        return <boxGeometry args={[1, 1, 1]} />
    }
  }

  // Material properties with selection and hover states
  const materialProps = {
    color: isSelected ? '#ffff00' : hovered ? '#ff6666' : object.color,
    transparent: true,
    opacity: isSelected ? 0.8 : hovered ? 0.9 : 1,
  }

  const renderMaterial = () => {
    switch (object.material || 'standard') {
      case 'basic':
        return <meshBasicMaterial {...materialProps} />
      case 'phong':
        return <meshPhongMaterial {...materialProps} />
      case 'standard':
      default:
        return <meshStandardMaterial {...materialProps} />
    }
  }

  return (
    <mesh
      ref={meshRef}
      position={object.position}
      rotation={object.rotation}
      scale={object.scale}
      onClick={handleClick}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerOver={(e) => {
        e.stopPropagation()
        setHovered(true)
        if (editorMode === 'select' && !isDragging) {
          document.body.style.cursor = isSelected ? 'grab' : 'pointer'
        }
      }}
      onPointerOut={(e) => {
        e.stopPropagation()
        setHovered(false)
        if (!isDragging) {
          document.body.style.cursor = 'default'
        }
      }}
      castShadow
      receiveShadow
    >
      {renderGeometry()}
      {renderMaterial()}
      
      {/* Selection outline */}
      {isSelected && (
        <mesh>
          {renderGeometry()}
          <meshBasicMaterial
            color="#ffffff"
            transparent
            opacity={0.3}
            wireframe
          />
        </mesh>
      )}
      
      {/* Move mode indicator */}
      {isSelected && isMoveModeActive && (
        <mesh position={[0, 1.5, 0]}>
          <sphereGeometry args={[0.1, 8, 8]} />
          <meshBasicMaterial color="#00ff00" />
        </mesh>
      )}
    </mesh>
  )
}

export default MapObject 