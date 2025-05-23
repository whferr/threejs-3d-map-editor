import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { OrbitControls, Grid } from '@react-three/drei'
import * as THREE from 'three'
import { useMapStore } from '../store/mapStore'
import MapObject from './MapObject'
import ClickHandler from './ClickHandler'

function Scene() {
  const { mapData } = useMapStore()
  
  // Set up lighting based on environment settings
  const ambientLightRef = useRef<THREE.AmbientLight>(null)
  const directionalLightRef = useRef<THREE.DirectionalLight>(null)

  useFrame(() => {
    if (ambientLightRef.current) {
      ambientLightRef.current.intensity = mapData.environment.ambientLight
    }
    if (directionalLightRef.current) {
      directionalLightRef.current.intensity = mapData.environment.directionalLight.intensity
      directionalLightRef.current.position.set(
        ...mapData.environment.directionalLight.position
      )
    }
  })

  return (
    <>
      {/* Camera Controls */}
      <OrbitControls
        makeDefault
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        maxPolarAngle={Math.PI / 2}
        minDistance={2}
        maxDistance={100}
      />

      {/* Lighting */}
      <ambientLight
        ref={ambientLightRef}
        intensity={mapData.environment.ambientLight}
      />
      <directionalLight
        ref={directionalLightRef}
        position={mapData.environment.directionalLight.position}
        intensity={mapData.environment.directionalLight.intensity}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={50}
        shadow-camera-left={-25}
        shadow-camera-right={25}
        shadow-camera-top={25}
        shadow-camera-bottom={-25}
      />

      {/* Grid */}
      <Grid
        args={[50, 50]}
        cellSize={1}
        cellThickness={0.5}
        cellColor="#6f6f6f"
        sectionSize={10}
        sectionThickness={1}
        sectionColor="#9d4b4b"
        fadeDistance={25}
        fadeStrength={1}
        followCamera={false}
        infiniteGrid={true}
      />

      {/* Ground Plane */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -0.1, 0]}
        receiveShadow
      >
        <planeGeometry args={[100, 100]} />
        <meshStandardMaterial
          color="#2a2a2a"
          transparent
          opacity={0.3}
        />
      </mesh>

      {/* Map Objects */}
      {mapData.objects.map((object) => (
        <MapObject key={object.id} object={object} />
      ))}

      {/* Click Handler for placing objects */}
      <ClickHandler />
    </>
  )
}

export default Scene 