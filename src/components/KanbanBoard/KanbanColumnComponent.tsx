import React, { useState } from 'react';
import { KanbanColumn, KanbanCard } from './types';
import KanbanCardItem from './KanbanCardItem';
import { v4 as uuidv4 } from 'uuid';
import { getRandomColor } from './mockData';

interface KanbanColumnProps {
  column: KanbanColumn;
  onAddCard: (columnId: string, card: KanbanCard) => void;
  onDeleteCard: (columnId: string, cardId: string) => void;
  onEditCard: (cardId: string, newTitle: string) => void;
  onDragStart: (e: React.DragEvent, cardId: string, columnId: string) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDropOnColumn: (e: React.DragEvent, columnId: string) => void;
  onCardDragOver: (e: React.DragEvent, cardId: string) => void;
  onCardDrop: (e: React.DragEvent, cardId: string, columnId: string) => void;
  dragOverCardId: string | null;
}

const KanbanColumnComponent: React.FC<KanbanColumnProps> = ({
  column,
  onAddCard,
  onDeleteCard,
  onEditCard,
  onDragStart,
  onDragOver,
  onDropOnColumn,
  onCardDragOver,
  onCardDrop,
  dragOverCardId,
}) => {
  const [showInput, setShowInput] = useState(false);
  const [newCardTitle, setNewCardTitle] = useState('');

  const handleAddCard = () => {
    if (newCardTitle.trim()) {
      onAddCard(column.id, {
        id: uuidv4(),
        title: newCardTitle.trim(),
        color: getRandomColor(),
      });
      setNewCardTitle('');
      setShowInput(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleAddCard();
    if (e.key === 'Escape') {
      setShowInput(false);
      setNewCardTitle('');
    }
  };

  return (
    <div
      className="kanban-column"
      onDragOver={onDragOver}
      onDrop={(e) => onDropOnColumn(e, column.id)}
    >
      {/* Column Header */}
      <div
        className="kanban-column-header d-flex justify-content-between align-items-center p-3 rounded-top"
        style={{ backgroundColor: column.color }}
      >
        <div className="d-flex align-items-center gap-2">
          <span className="text-white fw-bold">{column.title}</span>
          <span className="badge bg-white text-dark rounded-pill">
            {column.cards.length}
          </span>
        </div>
        <button
          className="btn btn-sm btn-light rounded-circle d-flex align-items-center justify-content-center"
          style={{ width: 28, height: 28, padding: 0 }}
          onClick={() => setShowInput(!showInput)}
          title="Add card"
        >
          <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
            <path d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2z" />
          </svg>
        </button>
      </div>

      {/* Column Body */}
      <div className="kanban-column-body p-2">
        {/* Add card button */}
        <button
          className="btn btn-sm text-muted w-100 text-start mb-2 kanban-add-btn"
          onClick={() => setShowInput(!showInput)}
        >
          + Add Card
        </button>

        {/* Add card input */}
        {showInput && (
          <div className="mb-2">
            <input
              className="form-control form-control-sm mb-2"
              placeholder="Enter card title..."
              value={newCardTitle}
              onChange={(e) => setNewCardTitle(e.target.value)}
              onKeyDown={handleKeyDown}
              autoFocus
            />
            <div className="d-flex gap-2">
              <button className="btn btn-sm btn-primary" onClick={handleAddCard}>
                Add
              </button>
              <button
                className="btn btn-sm btn-outline-secondary"
                onClick={() => {
                  setShowInput(false);
                  setNewCardTitle('');
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Cards */}
        {column.cards.map((card) => (
          <KanbanCardItem
            key={card.id}
            card={card}
            columnId={column.id}
            onEdit={onEditCard}
            onDelete={onDeleteCard}
            onDragStart={onDragStart}
            onDragOver={onCardDragOver}
            onDrop={onCardDrop}
            isDragOver={dragOverCardId === card.id}
          />
        ))}
      </div>
    </div>
  );
};

export default KanbanColumnComponent;
