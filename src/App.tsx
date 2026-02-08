import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import TreeView from './components/TreeView';
import KanbanBoard from './components/KanbanBoard';
import './App.css';

type Tab = 'kanban' | 'tree';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('kanban');

  return (
    <div className="app-container">
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-4">
        <span className="navbar-brand fw-bold">EZ Project</span>
        <div className="navbar-nav ms-auto flex-row gap-2">
          <button
            className={`btn btn-sm ${
              activeTab === 'kanban' ? 'btn-primary' : 'btn-outline-light'
            }`}
            onClick={() => setActiveTab('kanban')}
          >
            Kanban Board
          </button>
          <button
            className={`btn btn-sm ${
              activeTab === 'tree' ? 'btn-primary' : 'btn-outline-light'
            }`}
            onClick={() => setActiveTab('tree')}
          >
            Tree View
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container-fluid py-4 px-4">
        {activeTab === 'kanban' && <KanbanBoard />}
        {activeTab === 'tree' && <TreeView />}
      </div>
    </div>
  );
};

export default App;
