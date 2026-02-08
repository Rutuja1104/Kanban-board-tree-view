import React, { useState, useRef, useEffect } from 'react';
import { TreeNode } from './types';

interface TreeNodeItemProps {
  node: TreeNode;
  depth: number;
  onToggle: (id: string) => void;
  onAdd: (parentId: string, name: string) => void;
  onRemove: (id: string) => void;
  onEdit: (id: string, newName: string) => void;
  onDragStart: (node: TreeNode) => void;
  onDragOver: (targetId: string) => void;
  onDrop: (targetId: string) => void;
  dragOverId: string | null;
  draggingId: string | null;
}

const getLevelLabel = (depth: number): string => {
  const labels = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
  return labels[depth] || 'Z';
};

const getLevelColor = (depth: number): string => {
  if (depth === 0) return '#2196F3';
  return '#8BC34A';
};

const TreeNodeItem: React.FC<TreeNodeItemProps> = ({
  node,
  depth,
  onToggle,
  onAdd,
  onRemove,
  onEdit,
  onDragStart,
  onDragOver,
  onDrop,
  dragOverId,
  draggingId,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(node.name);
  const [showAddInput, setShowAddInput] = useState(false);
  const [newChildName, setNewChildName] = useState('');
  const editInputRef = useRef<HTMLInputElement>(null);
  const addInputRef = useRef<HTMLInputElement>(null);

  const levelLabel = getLevelLabel(depth);
  const levelColor = getLevelColor(depth);

  const hasChildren = (node.children && node.children.length > 0) || node.hasChildren;
  const isExpanded = node.isExpanded;

  useEffect(() => {
    if (isEditing && editInputRef.current) {
      editInputRef.current.focus();
      editInputRef.current.select();
    }
  }, [isEditing]);

  useEffect(() => {
    if (showAddInput && addInputRef.current) {
      addInputRef.current.focus();
    }
  }, [showAddInput]);

  const handleDoubleClick = () => {
    setIsEditing(true);
    setEditValue(node.name);
  };

  const handleEditSubmit = () => {
    if (editValue.trim()) {
      onEdit(node.id, editValue.trim());
    }
    setIsEditing(false);
  };

  const handleEditKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleEditSubmit();
    if (e.key === 'Escape') setIsEditing(false);
  };

  const handleAddChild = () => {
    if (newChildName.trim()) {
      onAdd(node.id, newChildName.trim());
      setNewChildName('');
      setShowAddInput(false);
    }
  };

  const handleAddKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleAddChild();
    if (e.key === 'Escape') {
      setShowAddInput(false);
      setNewChildName('');
    }
  };

  const handleDelete = () => {
    onRemove(node.id);
  };

  const handleDragStart = (e: React.DragEvent) => {
    e.stopPropagation();
    e.dataTransfer.setData('text/plain', node.id);
    e.dataTransfer.effectAllowed = 'move';
    onDragStart(node);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = 'move';
    onDragOver(node.id);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.stopPropagation();
  };

  const handleDropEvent = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onDrop(node.id);
  };

  const isDragOver = dragOverId === node.id;
  const isDragging = draggingId === node.id;

  return (
    <div className="tree-node-wrapper">
      <div
        className={`tree-node-item d-flex align-items-center py-1 px-2 rounded mb-1 ${
          isDragOver ? 'tree-node-drag-over' : ''
        } ${isDragging ? 'tree-node-dragging' : ''}`}
        style={{ marginLeft: depth * 28 }}
        draggable
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDropEvent}
      >
        {/* Connection lines */}
        {depth > 0 && (
          <div className="tree-connector" style={{ left: depth * 28 - 14 }} />
        )}

        {/* Expand/Collapse button */}
        {hasChildren ? (
          <button
            className="btn btn-sm p-0 me-1 tree-toggle-btn"
            onClick={() => onToggle(node.id)}
            title={isExpanded ? 'Collapse' : 'Expand'}
          >
            {node.isLoading ? (
              <span className="spinner-border spinner-border-sm text-secondary" style={{ width: 14, height: 14 }} />
            ) : isExpanded ? (
              <svg width="16" height="16" viewBox="0 0 16 16" fill="#999">
                <path d="M4 6l4 4 4-4H4z" />
              </svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 16 16" fill="#999">
                <path d="M6 4l4 4-4 4V4z" />
              </svg>
            )}
          </button>
        ) : (
          <span style={{ width: 20, display: 'inline-block' }} />
        )}

        {/* Level badge */}
        <span
          className="tree-level-badge d-flex align-items-center justify-content-center me-2"
          style={{
            backgroundColor: levelColor,
            color: '#fff',
            width: 26,
            height: 26,
            borderRadius: '50%',
            fontWeight: 600,
            fontSize: 13,
            flexShrink: 0,
          }}
        >
          {levelLabel}
        </span>

        {/* Node name */}
        {isEditing ? (
          <input
            ref={editInputRef}
            className="form-control form-control-sm tree-edit-input"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onBlur={handleEditSubmit}
            onKeyDown={handleEditKeyDown}
            style={{ maxWidth: 150 }}
          />
        ) : (
          <span
            className="tree-node-name me-2"
            onDoubleClick={handleDoubleClick}
            title="Double-click to edit"
          >
            {node.name}
          </span>
        )}

        {/* Action buttons */}
        <div className="tree-actions ms-auto d-flex gap-1">
          <button
            className="btn btn-sm btn-outline-success tree-action-btn"
            onClick={() => setShowAddInput(!showAddInput)}
            title="Add child node"
          >
            +
          </button>
          <button
            className="btn btn-sm btn-outline-primary tree-action-btn"
            onClick={handleDoubleClick}
            title="Edit node"
          >
            <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor">
              <path d="M12.146.854a.5.5 0 0 1 .708 0l2.292 2.292a.5.5 0 0 1 0 .708L5.854 13.146a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5 0 0 1 .131-.232L12.146.854z" />
            </svg>
          </button>
          <button
            className="btn btn-sm btn-outline-danger tree-action-btn"
            onClick={handleDelete}
            title="Delete node"
          >
            <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor">
              <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z" />
              <path fillRule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H5.5l1-1h3l1 1H13.5a1 1 0 0 1 1 1v1zM4.118 4L4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Add child input */}
      {showAddInput && (
        <div
          className="d-flex align-items-center mb-1 ms-3"
          style={{ marginLeft: (depth + 1) * 28 }}
        >
          <input
            ref={addInputRef}
            className="form-control form-control-sm me-2"
            placeholder="Enter node name..."
            value={newChildName}
            onChange={(e) => setNewChildName(e.target.value)}
            onKeyDown={handleAddKeyDown}
            style={{ maxWidth: 180 }}
          />
          <button
            className="btn btn-sm btn-success me-1"
            onClick={handleAddChild}
          >
            Add
          </button>
          <button
            className="btn btn-sm btn-secondary"
            onClick={() => {
              setShowAddInput(false);
              setNewChildName('');
            }}
          >
            Cancel
          </button>
        </div>
      )}

      {/* Children */}
      {isExpanded && node.children && node.children.length > 0 && (
        <div className="tree-children">
          {node.children.map((child) => (
            <TreeNodeItem
              key={child.id}
              node={child}
              depth={depth + 1}
              onToggle={onToggle}
              onAdd={onAdd}
              onRemove={onRemove}
              onEdit={onEdit}
              onDragStart={onDragStart}
              onDragOver={onDragOver}
              onDrop={onDrop}
              dragOverId={dragOverId}
              draggingId={draggingId}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default TreeNodeItem;
