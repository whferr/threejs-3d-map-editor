import { create } from 'zustand'

export type ObjectType = 'cube' | 'sphere' | 'cylinder' | 'plane'

export interface MapObject {
  id: string
  type: ObjectType
  position: [number, number, number]
  rotation: [number, number, number]
  scale: [number, number, number]
  color: string
  material?: 'standard' | 'basic' | 'phong'
  parentId?: string // For grouping
  name?: string // Display name
}

export interface ObjectGroup {
  id: string
  name: string
  children: string[] // Array of object/group IDs
  collapsed: boolean
  parentId?: string // For nested groups
}

export interface TerrainData {
  width: number
  height: number
  segments: number
  heightData: number[][]
}

export interface MapData {
  objects: MapObject[]
  groups: ObjectGroup[]
  terrain?: TerrainData
  environment: {
    backgroundColor: string
    ambientLight: number
    directionalLight: {
      intensity: number
      position: [number, number, number]
    }
  }
}

export type EditorMode = 'place' | 'select' | 'delete'

interface MapStore {
  mapData: MapData
  editorMode: EditorMode
  selectedObjectType: ObjectType
  selectedObjectId: string | null
  selectedGroupId: string | null
  isMoveModeActive: boolean // New state for movement mode

  // Actions
  setEditorMode: (mode: EditorMode) => void
  setSelectedObjectType: (type: ObjectType) => void
  selectObject: (id: string | null) => void
  selectGroup: (id: string | null) => void
  setMoveModeActive: (active: boolean) => void // New action
  addObject: (object: MapObject) => void
  removeObject: (id: string) => void
  updateObject: (id: string, updates: Partial<MapObject>) => void
  duplicateObject: (id: string) => void
  
  // Group actions
  createGroup: (name: string, objectIds: string[]) => void
  removeGroup: (id: string) => void
  addToGroup: (groupId: string, objectId: string) => void
  removeFromGroup: (groupId: string, objectId: string) => void
  toggleGroupCollapse: (id: string) => void
  renameObject: (id: string, name: string) => void
  renameGroup: (id: string, name: string) => void
  
  // Map actions
  clearMap: () => void
  loadMap: (data: MapData) => void
  exportMap: () => string
  updateEnvironment: (updates: Partial<MapData['environment']>) => void
  
  // Auto-save
  autoSave: () => void
}

const defaultMapData: MapData = {
  objects: [],
  groups: [],
  terrain: undefined,
  environment: {
    backgroundColor: '#2c3e50',
    ambientLight: 0.4,
    directionalLight: {
      intensity: 1,
      position: [10, 10, 5]
    }
  }
}

// Auto-save functionality
const AUTOSAVE_KEY = 'map-editor-autosave'
const saveToStorage = (data: MapData) => {
  try {
    localStorage.setItem(AUTOSAVE_KEY, JSON.stringify(data))
    localStorage.setItem(AUTOSAVE_KEY + '_timestamp', new Date().toISOString())
  } catch (error) {
    console.warn('Failed to save to localStorage:', error)
  }
}

const loadFromStorage = (): MapData => {
  try {
    const saved = localStorage.getItem(AUTOSAVE_KEY)
    if (saved) {
      const parsed = JSON.parse(saved)
      // Ensure groups array exists for backwards compatibility
      if (!parsed.groups) {
        parsed.groups = []
      }
      return parsed
    }
  } catch (error) {
    console.warn('Failed to load from localStorage:', error)
  }
  return defaultMapData
}

export const useMapStore = create<MapStore>((set, get) => ({
  mapData: loadFromStorage(),
  editorMode: 'place',
  selectedObjectType: 'cube',
  selectedObjectId: null,
  selectedGroupId: null,
  isMoveModeActive: false,

  setEditorMode: (mode) => set({ editorMode: mode }),
  setSelectedObjectType: (type) => set({ selectedObjectType: type }),
  selectObject: (id) => set({ selectedObjectId: id, selectedGroupId: null }),
  selectGroup: (id) => set({ selectedGroupId: id, selectedObjectId: null }),
  setMoveModeActive: (active) => set({ isMoveModeActive: active }),

  addObject: (object) => {
    const objectWithName = {
      ...object,
      name: object.name || `${object.type}_${Date.now()}`
    }
    set((state) => {
      const newMapData = {
        ...state.mapData,
        objects: [...state.mapData.objects, objectWithName]
      }
      saveToStorage(newMapData)
      return { mapData: newMapData }
    })
  },

  removeObject: (id) =>
    set((state) => {
      const newMapData = {
        ...state.mapData,
        objects: state.mapData.objects.filter(obj => obj.id !== id),
        groups: state.mapData.groups.map(group => ({
          ...group,
          children: group.children.filter(childId => childId !== id)
        }))
      }
      saveToStorage(newMapData)
      return { 
        mapData: newMapData,
        selectedObjectId: state.selectedObjectId === id ? null : state.selectedObjectId
      }
    }),

  updateObject: (id, updates) =>
    set((state) => {
      const newMapData = {
        ...state.mapData,
        objects: state.mapData.objects.map(obj =>
          obj.id === id ? { ...obj, ...updates } : obj
        )
      }
      saveToStorage(newMapData)
      return { mapData: newMapData }
    }),

  duplicateObject: (id) => {
    const { mapData } = get()
    const original = mapData.objects.find(obj => obj.id === id)
    if (original) {
      const duplicate = {
        ...original,
        id: `object_${Date.now()}_${Math.random()}`,
        name: `${original.name}_copy`,
        position: [
          original.position[0] + 1,
          original.position[1],
          original.position[2]
        ] as [number, number, number]
      }
      get().addObject(duplicate)
    }
  },

  createGroup: (name, objectIds) =>
    set((state) => {
      const newGroup: ObjectGroup = {
        id: `group_${Date.now()}_${Math.random()}`,
        name,
        children: objectIds,
        collapsed: false
      }
      const newMapData = {
        ...state.mapData,
        groups: [...state.mapData.groups, newGroup],
        objects: state.mapData.objects.map(obj =>
          objectIds.includes(obj.id) ? { ...obj, parentId: newGroup.id } : obj
        )
      }
      saveToStorage(newMapData)
      return { mapData: newMapData }
    }),

  removeGroup: (id) =>
    set((state) => {
      const group = state.mapData.groups.find(g => g.id === id)
      if (!group) return state

      const newMapData = {
        ...state.mapData,
        groups: state.mapData.groups.filter(g => g.id !== id),
        objects: state.mapData.objects.map(obj =>
          group.children.includes(obj.id) ? { ...obj, parentId: undefined } : obj
        )
      }
      saveToStorage(newMapData)
      return { 
        mapData: newMapData,
        selectedGroupId: state.selectedGroupId === id ? null : state.selectedGroupId
      }
    }),

  addToGroup: (groupId, objectId) =>
    set((state) => {
      const newMapData = {
        ...state.mapData,
        groups: state.mapData.groups.map(group =>
          group.id === groupId ? { ...group, children: [...group.children, objectId] } : group
        ),
        objects: state.mapData.objects.map(obj =>
          obj.id === objectId ? { ...obj, parentId: groupId } : obj
        )
      }
      saveToStorage(newMapData)
      return { mapData: newMapData }
    }),

  removeFromGroup: (groupId, objectId) =>
    set((state) => {
      const newMapData = {
        ...state.mapData,
        groups: state.mapData.groups.map(group =>
          group.id === groupId ? { ...group, children: group.children.filter(id => id !== objectId) } : group
        ),
        objects: state.mapData.objects.map(obj =>
          obj.id === objectId ? { ...obj, parentId: undefined } : obj
        )
      }
      saveToStorage(newMapData)
      return { mapData: newMapData }
    }),

  toggleGroupCollapse: (id) =>
    set((state) => {
      const newMapData = {
        ...state.mapData,
        groups: state.mapData.groups.map(group =>
          group.id === id ? { ...group, collapsed: !group.collapsed } : group
        )
      }
      saveToStorage(newMapData)
      return { mapData: newMapData }
    }),

  renameObject: (id, name) =>
    set((state) => {
      const newMapData = {
        ...state.mapData,
        objects: state.mapData.objects.map(obj =>
          obj.id === id ? { ...obj, name } : obj
        )
      }
      saveToStorage(newMapData)
      return { mapData: newMapData }
    }),

  renameGroup: (id, name) =>
    set((state) => {
      const newMapData = {
        ...state.mapData,
        groups: state.mapData.groups.map(group =>
          group.id === id ? { ...group, name } : group
        )
      }
      saveToStorage(newMapData)
      return { mapData: newMapData }
    }),

  clearMap: () => {
    set({ mapData: defaultMapData, selectedObjectId: null, selectedGroupId: null })
    saveToStorage(defaultMapData)
  },

  loadMap: (data) => {
    // Ensure groups array exists for backwards compatibility
    const mapDataWithGroups = {
      ...data,
      groups: data.groups || []
    }
    set({ mapData: mapDataWithGroups, selectedObjectId: null, selectedGroupId: null })
    saveToStorage(mapDataWithGroups)
  },

  exportMap: () => {
    return JSON.stringify(get().mapData, null, 2)
  },

  updateEnvironment: (updates) =>
    set((state) => {
      const newMapData = {
        ...state.mapData,
        environment: {
          ...state.mapData.environment,
          ...updates
        }
      }
      saveToStorage(newMapData)
      return { mapData: newMapData }
    }),

  autoSave: () => {
    const { mapData } = get()
    saveToStorage(mapData)
  }
}))

 