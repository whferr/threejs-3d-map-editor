# Three.js 3D Map Editor | WebGL Game Level Designer | React Three Fiber Editor

🚀 **Professional 3D Map Editor** built with Three.js, React Three Fiber, and TypeScript. Create stunning 3D game levels, interactive maps, and immersive 3D environments directly in your browser.

[![Three.js](https://img.shields.io/badge/Three.js-000000?style=for-the-badge&logo=three.js&logoColor=white)](https://threejs.org/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![WebGL](https://img.shields.io/badge/WebGL-990000?style=for-the-badge&logo=webgl&logoColor=white)](https://www.khronos.org/webgl/)

## 🎮 Features | 3D Level Design Tools

### 🔥 Core 3D Editing Capabilities
- **Real-time 3D Scene Rendering** with Three.js WebGL engine
- **Interactive Camera Controls** - Orbit, pan, zoom, and fly navigation
- **Minecraft-style Block Placement** with intelligent stacking system
- **Professional Movement System** with Blender-inspired shortcuts (G for grab)
- **Visual Object Hierarchy** with Figma-like layer management
- **Autosave Functionality** with localStorage persistence
- **Grid-based Snapping** for precise object placement

### 🛠️ Professional Editor Modes
- **🎯 Select Mode**: Advanced object selection with visual indicators
- **🏗️ Place Mode**: Intelligent 3D object placement with automatic stacking
- **🗑️ Delete Mode**: Quick object removal with keyboard shortcuts
- **🎮 Move Mode**: 3D transformation with horizontal/vertical constraints

### 📦 3D Object Library
- **Geometric Primitives**: Cubes, spheres, cylinders, planes
- **Material System**: Standard PBR, Basic, Phong materials
- **Color Customization**: Full HSV color picker integration
- **Transform Controls**: Position, rotation, scale manipulation
- **Object Grouping**: Hierarchy management and bulk operations

### ⌨️ Professional Keyboard Shortcuts
- **G**: Grab/Move mode (Blender-style)
- **1/2/3**: Quick mode switching
- **Shift + Drag**: Vertical movement
- **Delete/X**: Quick object deletion
- **Esc**: Cancel operations

## 🚀 Quick Start | Get Building in 3 Minutes

### Prerequisites
```bash
Node.js 16+ | npm/yarn | Modern browser with WebGL support
```

### Installation
```bash
# Clone the repository
git clone [https://github.com/whferr/threejs-3d-map-editor]
cd threejs-3d-map-editor

# Install dependencies
npm install

# Start development server
npm run dev

# Open http://localhost:5173
```

### Production Build
```bash
npm run build     # Build for production
npm run preview   # Preview production build
```

## 🎨 How to Use | 3D Map Creation Guide

### 1. **Basic 3D Object Placement**
```
1. Press '2' for Place Mode
2. Select object type from toolbar
3. Click on ground or existing objects to place
4. Objects automatically stack like Minecraft blocks
```

### 2. **Advanced Object Manipulation**
```
1. Press '1' for Select Mode
2. Click any object to select
3. Press 'G' to enter Move Mode
4. Drag to move horizontally
5. Shift+Drag for vertical movement
```

### 3. **Professional Workflow**
```
• Use object hierarchy panel for organization
• Rename objects for better project management
• Group related objects together
• Export/import maps as JSON files
```

## 🏗️ Technical Architecture | Modern Web Stack

### Core Technologies
- **Three.js**: Industry-standard 3D graphics library
- **React Three Fiber**: Declarative 3D scene management
- **TypeScript**: Type-safe development
- **Zustand**: Lightweight state management
- **Vite**: Lightning-fast build tool

### Performance Features
- **WebGL Rendering**: Hardware-accelerated 3D graphics
- **Component-based Architecture**: Scalable React patterns
- **Efficient State Management**: Minimal re-renders
- **Grid-based Optimization**: Spatial indexing for large scenes

## 📁 Project Structure | Clean Architecture

```
src/
├── components/
│   ├── Scene.tsx              # Main 3D scene setup
│   ├── MapObject.tsx          # 3D object rendering
│   ├── ClickHandler.tsx       # Mouse interaction logic
│   ├── Toolbar.tsx            # Left panel tools
│   ├── ObjectHierarchy.tsx    # Layer management
│   ├── StatusBar.tsx          # Mode indicators
│   └── KeyboardController.tsx # Shortcut handling
├── store/
│   └── mapStore.ts           # Zustand state management
├── utils/
│   └── coordinates.ts        # 3D math utilities
└── styles/
    └── App.css              # Modern UI styling
```

## 🎯 Use Cases | Who Benefits

### 🎮 Game Developers
- **Indie Game Level Design**: Rapid prototyping for 3D platformers
- **Level Blocking**: Quick gameplay layout testing
- **Asset Placement**: Environment object positioning

### 🏗️ 3D Artists & Designers
- **Concept Visualization**: 3D scene composition
- **Architectural Mockups**: Basic building layouts
- **Educational Projects**: 3D modeling learning tool

### 🎓 Students & Educators
- **Three.js Learning**: Hands-on WebGL experience
- **3D Math Concepts**: Transform matrix understanding
- **React Development**: Modern frontend patterns

## 🔧 Map File Format | JSON Schema

```json
{
  "objects": [
    {
      "id": "cube_1234567890_abc123",
      "type": "cube",
      "name": "Platform Block",
      "position": [0, 0.5, 0],
      "rotation": [0, 0, 0],
      "scale": [1, 1, 1],
      "color": "#4a90e2",
      "material": "standard"
    }
  ],
  "environment": {
    "backgroundColor": "#87CEEB",
    "ambientLight": 0.6,
    "directionalLight": {
      "intensity": 1,
      "position": [10, 10, 5]
    }
  },
  "metadata": {
    "version": "1.0",
    "created": "2024-01-01T00:00:00Z",
    "modified": "2024-01-01T00:00:00Z"
  }
}
```

## 🌟 Advanced Features | Professional Tools

### 🔄 Smart Stacking System
- **Minecraft-style Building**: Click objects to stack on top
- **Automatic Height Calculation**: Precise vertical positioning
- **Grid Alignment**: Perfect block placement every time

### 🎨 Visual Feedback
- **Selection Indicators**: Yellow highlighting for active objects
- **Move Mode Visualization**: Green indicator during movement
- **Grid Overlay**: Optional snap-to-grid display

### 💾 Project Management
- **Auto-save**: Automatic progress preservation
- **Export/Import**: JSON-based project files
- **Undo/Redo**: Action history tracking (coming soon)

## 🚧 Roadmap | Future Enhancements

### Short Term (v1.1)
- [ ] **Undo/Redo System**: Full action history
- [ ] **Multi-selection**: Select and move multiple objects
- [ ] **Copy/Paste**: Duplicate objects and patterns

### Medium Term (v1.2)
- [ ] **Terrain Editor**: Height map manipulation
- [ ] **Texture System**: Material and texture library
- [ ] **Lighting Controls**: Multiple light sources

### Long Term (v2.0)
- [ ] **Model Import**: GLB/GLTF support
- [ ] **Physics Preview**: Collision detection
- [ ] **Collaborative Editing**: Real-time multiplayer

## 🤝 Contributing | Join the Community

We welcome contributions from:
- **3D Graphics Developers**: Three.js experts
- **React Developers**: Frontend specialists  
- **Game Developers**: Level design experience
- **UI/UX Designers**: User experience improvements

### Development Setup
```bash
npm install        # Install dependencies
npm run dev       # Start development server
npm run build     # Test production build
npm run lint      # Check code quality
```

## 📊 SEO Keywords

**Primary**: Three.js map editor, 3D level design tool, React Three Fiber editor, WebGL map maker, browser-based 3D editor

**Secondary**: JavaScript 3D modeling, TypeScript game tools, web-based level editor, Minecraft-style builder, 3D scene composer

**Technical**: R3F editor, WebGL level designer, Three.js scene builder, browser 3D modeling, React 3D editor

## 📄 License

MIT License - Free for commercial and personal use

---

⭐ **Star this repo** if you find it useful! | 🐛 **Report issues** | 🔄 **Fork and contribute**

*Built with ❤️ using Three.js, React Three Fiber, and TypeScript* 