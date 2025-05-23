import React, { useState } from 'react'
import { useMapStore } from '../store/mapStore'

interface ObjectHierarchyProps {}

function ObjectHierarchy({}: ObjectHierarchyProps) {
  const {
    mapData,
    selectedObjectId,
    selectedGroupId,
    selectObject,
    selectGroup,
    removeObject,
    removeGroup,
    createGroup,
    toggleGroupCollapse,
    renameObject,
    renameGroup,
    duplicateObject
  } = useMapStore()

  const [showGroupDialog, setShowGroupDialog] = useState(false)
  const [groupName, setGroupName] = useState('')
  const [selectedObjects, setSelectedObjects] = useState<string[]>([])
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editingName, setEditingName] = useState('')

  // Get ungrouped objects (objects not in any group)
  const ungroupedObjects = mapData.objects.filter(obj => !obj.parentId)

  const handleCreateGroup = () => {
    if (groupName.trim() && selectedObjects.length > 0) {
      createGroup(groupName.trim(), selectedObjects)
      setShowGroupDialog(false)
      setGroupName('')
      setSelectedObjects([])
    }
  }

  const handleStartEdit = (id: string, currentName: string) => {
    setEditingId(id)
    setEditingName(currentName)
  }

  const handleFinishEdit = () => {
    if (editingId && editingName.trim()) {
      if (editingId.startsWith('group_')) {
        renameGroup(editingId, editingName.trim())
      } else {
        renameObject(editingId, editingName.trim())
      }
    }
    setEditingId(null)
    setEditingName('')
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleFinishEdit()
    } else if (e.key === 'Escape') {
      setEditingId(null)
      setEditingName('')
    }
  }

  const toggleObjectSelection = (objectId: string) => {
    setSelectedObjects(prev => 
      prev.includes(objectId) 
        ? prev.filter(id => id !== objectId)
        : [...prev, objectId]
    )
  }

  const getObjectIcon = (type: string) => {
    switch (type) {
      case 'cube': return '□'
      case 'sphere': return '○'
      case 'cylinder': return '⬟'
      case 'plane': return '▬'
      default: return '□'
    }
  }

  const renderObject = (object: any, depth = 0) => {
    const isSelected = selectedObjectId === object.id
    const isChecked = selectedObjects.includes(object.id)
    const isEditing = editingId === object.id

    return (
      <div
        key={object.id}
        className={`hierarchy-item ${isSelected ? 'selected' : ''}`}
        style={{ paddingLeft: `${depth * 16 + 8}px` }}
      >
        <div className="hierarchy-item-content">
          <input
            type="checkbox"
            checked={isChecked}
            onChange={() => toggleObjectSelection(object.id)}
            className="object-checkbox"
          />
          <span className="object-icon">{getObjectIcon(object.type)}</span>
          {isEditing ? (
            <input
              type="text"
              value={editingName}
              onChange={(e) => setEditingName(e.target.value)}
              onBlur={handleFinishEdit}
              onKeyDown={handleKeyPress}
              className="name-input"
              autoFocus
            />
          ) : (
            <span
              className="object-name"
              onClick={() => selectObject(object.id)}
              onDoubleClick={() => handleStartEdit(object.id, object.name || object.type)}
            >
              {object.name || object.type}
            </span>
          )}
          <div className="object-actions">
            <button
              onClick={() => duplicateObject(object.id)}
              className="action-btn"
              title="Duplicate"
            >
              ⧉
            </button>
            <button
              onClick={() => removeObject(object.id)}
              className="action-btn danger"
              title="Delete"
            >
              ×
            </button>
          </div>
        </div>
      </div>
    )
  }

  const renderGroup = (group: any, depth = 0) => {
    const isSelected = selectedGroupId === group.id
    const isEditing = editingId === group.id
    const groupObjects = mapData.objects.filter(obj => obj.parentId === group.id)

    return (
      <div key={group.id} className={`hierarchy-group ${isSelected ? 'selected' : ''}`}>
        <div
          className="hierarchy-item-content"
          style={{ paddingLeft: `${depth * 16 + 8}px` }}
        >
          <button
            onClick={() => toggleGroupCollapse(group.id)}
            className="collapse-btn"
          >
            {group.collapsed ? '▶' : '▼'}
          </button>
          <span className="group-icon">📁</span>
          {isEditing ? (
            <input
              type="text"
              value={editingName}
              onChange={(e) => setEditingName(e.target.value)}
              onBlur={handleFinishEdit}
              onKeyDown={handleKeyPress}
              className="name-input"
              autoFocus
            />
          ) : (
            <span
              className="group-name"
              onClick={() => selectGroup(group.id)}
              onDoubleClick={() => handleStartEdit(group.id, group.name)}
            >
              {group.name}
            </span>
          )}
          <div className="object-actions">
            <button
              onClick={() => removeGroup(group.id)}
              className="action-btn danger"
              title="Delete Group"
            >
              ×
            </button>
          </div>
        </div>
        {!group.collapsed && (
          <div className="group-children">
            {groupObjects.map(obj => renderObject(obj, depth + 1))}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="object-hierarchy">
      <div className="hierarchy-header">
        <h3>Layers</h3>
        <div className="hierarchy-actions">
          <button
            onClick={() => setShowGroupDialog(true)}
            disabled={selectedObjects.length === 0}
            className="create-group-btn"
            title="Create Group from Selected"
          >
            Group
          </button>
        </div>
      </div>

      <div className="hierarchy-content">
        {/* Render groups */}
        {mapData.groups.map(group => renderGroup(group, 0))}
        
        {/* Render ungrouped objects */}
        {ungroupedObjects.map(obj => renderObject(obj, 0))}
        
        {mapData.objects.length === 0 && (
          <div className="empty-state">
            No objects in scene
          </div>
        )}
      </div>

      {/* Group creation dialog */}
      {showGroupDialog && (
        <div className="dialog-overlay">
          <div className="dialog">
            <h4>Create Group</h4>
            <input
              type="text"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              placeholder="Group name"
              className="group-name-input"
              autoFocus
            />
            <div className="dialog-actions">
              <button onClick={handleCreateGroup} disabled={!groupName.trim()}>
                Create
              </button>
              <button onClick={() => setShowGroupDialog(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ObjectHierarchy 