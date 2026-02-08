export interface KanbanCard {
  id: string;
  title: string;
  color: string; // Left border color accent
}

export interface KanbanColumn {
  id: string;
  title: string;
  color: string; // Header background color
  cards: KanbanCard[];
}
