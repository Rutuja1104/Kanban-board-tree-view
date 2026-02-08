import { KanbanColumn } from './types';
import { v4 as uuidv4 } from 'uuid';

const cardColors = ['#f39c12', '#e74c3c', '#2ecc71', '#3498db', '#9b59b6'];

export const getRandomColor = (): string =>
  cardColors[Math.floor(Math.random() * cardColors.length)];

export const initialColumns: KanbanColumn[] = [
  {
    id: 'todo',
    title: 'Todo',
    color: '#3498db',
    cards: [
      { id: uuidv4(), title: 'Create initial project plan', color: '#f39c12' },
      { id: uuidv4(), title: 'Design landing page', color: '#e74c3c' },
      { id: uuidv4(), title: 'Review codebase structure', color: '#2ecc71' },
    ],
  },
  {
    id: 'in-progress',
    title: 'In Progress',
    color: '#f39c12',
    cards: [
      { id: uuidv4(), title: 'Implement authentication', color: '#e74c3c' },
      { id: uuidv4(), title: 'Set up database schema', color: '#f39c12' },
      { id: uuidv4(), title: 'Fix navbar bugs', color: '#2ecc71' },
    ],
  },
  {
    id: 'done',
    title: 'Done',
    color: '#2ecc71',
    cards: [
      { id: uuidv4(), title: 'Organize project repository', color: '#3498db' },
      { id: uuidv4(), title: 'Write API documentation', color: '#2ecc71' },
    ],
  },
];
