import React, { useState } from 'react';
import { KanbanColumn, KanbanCard } from './types';
import { initialColumns } from './mockData';
import KanbanColumnComponent from './KanbanColumnComponent';
import './KanbanBoard.css';

const KanbanBoard: React.FC = () => {
  const [columns, setColumns] = useState<KanbanColumn[]>(initialColumns);
  const [dragState, setDragState] = useState<{
    cardId: string;
    sourceColumnId: string;
  } | null>(null);
  const [dragOverCardId, setDragOverCardId] = useState<string | null>(null);

  // Add card to column
  const handleAddCard = (columnId: string, card: KanbanCard) => {
    setColumns((prev) =>
      prev.map((col) =>
        col.id === columnId ? { ...col, cards: [...col.cards, card] } : col
      )
    );
  };

  // Delete card from column
  const handleDeleteCard = (columnId: string, cardId: string) => {
    setColumns((prev) =>
      prev.map((col) =>
        col.id === columnId
          ? { ...col, cards: col.cards.filter((c) => c.id !== cardId) }
          : col
      )
    );
  };

  // Edit card title
  const handleEditCard = (cardId: string, newTitle: string) => {
    setColumns((prev) =>
      prev.map((col) => ({
        ...col,
        cards: col.cards.map((c) =>
          c.id === cardId ? { ...c, title: newTitle } : c
        ),
      }))
    );
  };

  // Drag start
  const handleDragStart = (
    e: React.DragEvent,
    cardId: string,
    columnId: string
  ) => {
    e.dataTransfer.setData('text/plain', cardId);
    e.dataTransfer.effectAllowed = 'move';
    setDragState({ cardId, sourceColumnId: columnId });
  };

  // Drag over column
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  // Drag over card (for reorder)
  const handleCardDragOver = (e: React.DragEvent, cardId: string) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOverCardId(cardId);
  };

  // Drop on card (reorder within or across columns)
  const handleCardDrop = (
    e: React.DragEvent,
    targetCardId: string,
    targetColumnId: string
  ) => {
    e.preventDefault();
    e.stopPropagation();

    if (!dragState) return;
    const { cardId, sourceColumnId } = dragState;
    if (cardId === targetCardId) {
      setDragState(null);
      setDragOverCardId(null);
      return;
    }

    setColumns((prev) => {
      const newCols = prev.map((col) => ({ ...col, cards: [...col.cards] }));

      // Find and remove the dragged card from source
      const sourceCol = newCols.find((c) => c.id === sourceColumnId);
      if (!sourceCol) return prev;
      const cardIndex = sourceCol.cards.findIndex((c) => c.id === cardId);
      if (cardIndex === -1) return prev;
      const [draggedCard] = sourceCol.cards.splice(cardIndex, 1);

      // Find target column and insert before target card
      const targetCol = newCols.find((c) => c.id === targetColumnId);
      if (!targetCol) return prev;
      const targetIndex = targetCol.cards.findIndex(
        (c) => c.id === targetCardId
      );
      if (targetIndex === -1) {
        targetCol.cards.push(draggedCard);
      } else {
        targetCol.cards.splice(targetIndex, 0, draggedCard);
      }

      return newCols;
    });

    setDragState(null);
    setDragOverCardId(null);
  };

  // Drop on column (move to end)
  const handleDropOnColumn = (e: React.DragEvent, targetColumnId: string) => {
    e.preventDefault();

    if (!dragState) return;
    const { cardId, sourceColumnId } = dragState;

    setColumns((prev) => {
      const newCols = prev.map((col) => ({ ...col, cards: [...col.cards] }));

      // Find and remove the dragged card
      const sourceCol = newCols.find((c) => c.id === sourceColumnId);
      if (!sourceCol) return prev;
      const cardIndex = sourceCol.cards.findIndex((c) => c.id === cardId);
      if (cardIndex === -1) return prev;
      const [draggedCard] = sourceCol.cards.splice(cardIndex, 1);

      // Add to target column
      const targetCol = newCols.find((c) => c.id === targetColumnId);
      if (!targetCol) return prev;

      // Only add if not already there
      if (!targetCol.cards.find((c) => c.id === cardId)) {
        targetCol.cards.push(draggedCard);
      }

      return newCols;
    });

    setDragState(null);
    setDragOverCardId(null);
  };

  return (
    <div className="kanban-board-container">
      <h4 className="mb-3 fw-bold text-dark">Kanban Board</h4>
      <div className="kanban-board d-flex gap-3">
        {columns.map((column) => (
          <KanbanColumnComponent
            key={column.id}
            column={column}
            onAddCard={handleAddCard}
            onDeleteCard={handleDeleteCard}
            onEditCard={handleEditCard}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDropOnColumn={handleDropOnColumn}
            onCardDragOver={handleCardDragOver}
            onCardDrop={handleCardDrop}
            dragOverCardId={dragOverCardId}
          />
        ))}
      </div>
    </div>
  );
};

export default KanbanBoard;
