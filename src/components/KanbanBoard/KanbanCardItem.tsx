import React, { useState, useRef, useEffect } from 'react';
import { KanbanCard } from './types';

interface KanbanCardItemProps {
  card: KanbanCard;
  columnId: string;
  onEdit: (cardId: string, newTitle: string) => void;
  onDelete: (columnId: string, cardId: string) => void;
  onDragStart: (e: React.DragEvent, cardId: string, columnId: string) => void;
  onDragOver: (e: React.DragEvent, cardId: string) => void;
  onDrop: (e: React.DragEvent, cardId: string, columnId: string) => void;
  isDragOver: boolean;
}

const KanbanCardItem: React.FC<KanbanCardItemProps> = ({
  card,
  columnId,
  onEdit,
  onDelete,
  onDragStart,
  onDragOver,
  onDrop,
  isDragOver,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(card.title);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleDoubleClick = () => {
    setIsEditing(true);
    setEditValue(card.title);
  };

  const handleSubmit = () => {
    if (editValue.trim()) {
      onEdit(card.id, editValue.trim());
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSubmit();
    if (e.key === 'Escape') setIsEditing(false);
  };

  return (
    <div
      className={`kanban-card bg-white rounded shadow-sm mb-2 p-2 d-flex align-items-center ${
        isDragOver ? 'kanban-card-drag-over' : ''
      }`}
      style={{ borderLeft: `4px solid ${card.color}` }}
      draggable
      onDragStart={(e) => onDragStart(e, card.id, columnId)}
      onDragOver={(e) => onDragOver(e, card.id)}
      onDrop={(e) => onDrop(e, card.id, columnId)}
    >
      {isEditing ? (
        <input
          ref={inputRef}
          className="form-control form-control-sm flex-grow-1 me-2"
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onBlur={handleSubmit}
          onKeyDown={handleKeyDown}
        />
      ) : (
        <span
          className="kanban-card-title flex-grow-1"
          onDoubleClick={handleDoubleClick}
          title="Double-click to edit"
        >
          {card.title}
        </span>
      )}

      <button
        className="btn btn-sm kanban-delete-btn ms-2"
        onClick={() => onDelete(columnId, card.id)}
        title="Delete card"
      >
        <svg width="14" height="14" viewBox="0 0 16 16" fill="#e74c3c">
          <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z" />
          <path
            fillRule="evenodd"
            d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H5.5l1-1h3l1 1H13.5a1 1 0 0 1 1 1v1zM4.118 4L4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"
          />
        </svg>
      </button>
    </div>
  );
};

export default KanbanCardItem;
