import { Canvas } from '@react-three/fiber'
import { OrbitControls, Environment } from '@react-three/drei'
import Scene from './components/Scene'
import Toolbar from './components/Toolbar'
import ObjectHierarchy from './components/ObjectHierarchy'
import KeyboardController from './components/KeyboardController'
import StatusBar from './components/StatusBar'
import './styles/App.css'

function App() {
  return (
    <div className="app">
      {/* Global keyboard controller */}
      <KeyboardController />
      
      {/* Left Panel - Object Hierarchy */}
      <div className="left-panel">
        <ObjectHierarchy />
      </div>

      {/* Main Content */}
      <div className="main-content">
        {/* Top Toolbar */}
        <div className="top-toolbar">
          <Toolbar />
        </div>

        {/* 3D Canvas */}
        <div className="canvas-container">
          <Canvas
            camera={{ position: [10, 10, 10], fov: 60 }}
            shadows
          >
            <Environment preset="sunset" />
            <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />
            <Scene />
          </Canvas>
        </div>
        
        {/* Bottom Status Bar */}
        <StatusBar />
      </div>
    </div>
  )
}

export default App 