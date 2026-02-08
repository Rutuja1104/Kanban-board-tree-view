import React, { useState, useCallback } from 'react';
import { TreeNode } from './types';
import { initialTreeData, fetchChildren } from './mockData';
import TreeNodeItem from './TreeNodeItem';
import { InputModal, ConfirmModal } from './Modal';
import { v4 as uuidv4 } from 'uuid';
import './TreeView.css';

const updateNode = (
  nodes: TreeNode[],
  id: string,
  updater: (node: TreeNode) => TreeNode
): TreeNode[] => {
  return nodes.map((node) => {
    if (node.id === id) return updater(node);
    if (node.children) {
      return { ...node, children: updateNode(node.children, id, updater) };
    }
    return node;
  });
};

const removeNode = (nodes: TreeNode[], id: string): TreeNode[] => {
  return nodes
    .filter((node) => node.id !== id)
    .map((node) => ({
      ...node,
      children: node.children ? removeNode(node.children, id) : undefined,
    }));
};

const findNode = (nodes: TreeNode[], id: string): TreeNode | null => {
  for (const node of nodes) {
    if (node.id === id) return node;
    if (node.children) {
      const found = findNode(node.children, id);
      if (found) return found;
    }
  }
  return null;
};

const isDescendant = (nodes: TreeNode[], sourceId: string, targetId: string): boolean => {
  const source = findNode(nodes, sourceId);
  if (!source || !source.children) return false;
  for (const child of source.children) {
    if (child.id === targetId) return true;
    if (isDescendant([child], child.id, targetId)) return true;
  }
  return false;
};

const cloneTree = (nodes: TreeNode[]): TreeNode[] =>
  JSON.parse(JSON.stringify(nodes));

const TreeView: React.FC = () => {
  const [treeData, setTreeData] = useState<TreeNode[]>(initialTreeData);
  const [dragOverId, setDragOverId] = useState<string | null>(null);
  const [draggingNode, setDraggingNode] = useState<TreeNode | null>(null);
  const [showAddRootModal, setShowAddRootModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);

  const handleToggle = useCallback(
    async (id: string) => {
      const node = findNode(treeData, id);
      if (!node) return;

      if (node.hasChildren && (!node.children || node.children.length === 0) && !node.isExpanded) {
        setTreeData((prev) => updateNode(prev, id, (n) => ({ ...n, isLoading: true })));

        try {
          const children = await fetchChildren(id);
          setTreeData((prev) =>
            updateNode(prev, id, (n) => ({
              ...n,
              children,
              isExpanded: true,
              isLoading: false,
              hasChildren: false,
            }))
          );
        } catch {
          setTreeData((prev) => updateNode(prev, id, (n) => ({ ...n, isLoading: false })));
        }
      } else {
        setTreeData((prev) => updateNode(prev, id, (n) => ({ ...n, isExpanded: !n.isExpanded })));
      }
    },
    [treeData]
  );

  // Add child node
  const handleAdd = useCallback((parentId: string, name: string) => {
    const newNode: TreeNode = {
      id: uuidv4(),
      name,
      children: [],
      hasChildren: false,
    };
    setTreeData((prev) =>
      updateNode(prev, parentId, (n) => ({
        ...n,
        children: [...(n.children || []), newNode],
        isExpanded: true,
      }))
    );
  }, []);

  // Remove node - show confirm modal
  const handleRemoveRequest = useCallback((id: string) => {
    const node = findNode(treeData, id);
    setDeleteTarget({ id, name: node?.name || 'this node' });
  }, [treeData]);

  const handleRemoveConfirm = useCallback(() => {
    if (deleteTarget) {
      setTreeData((prev) => removeNode(prev, deleteTarget.id));
      setDeleteTarget(null);
    }
  }, [deleteTarget]);

  // Edit node name
  const handleEdit = useCallback((id: string, newName: string) => {
    setTreeData((prev) => updateNode(prev, id, (n) => ({ ...n, name: newName })));
  }, []);

  // Drag and drop handlers
  const handleDragStart = (node: TreeNode) => {
    setDraggingNode(node);
  };

  const handleDragOver = (targetId: string) => {
    if (draggingNode && draggingNode.id !== targetId) {
      setDragOverId(targetId);
    }
  };

  const handleDrop = (targetId: string) => {
    if (!draggingNode || draggingNode.id === targetId) {
      setDragOverId(null);
      setDraggingNode(null);
      return;
    }

    if (isDescendant(treeData, draggingNode.id, targetId)) {
      setDragOverId(null);
      setDraggingNode(null);
      return;
    }

    const draggedNodeClone = cloneTree([findNode(treeData, draggingNode.id)!])[0];
    let newTree = removeNode(treeData, draggingNode.id);
    newTree = updateNode(newTree, targetId, (n) => ({
      ...n,
      children: [...(n.children || []), draggedNodeClone],
      isExpanded: true,
    }));

    setTreeData(newTree);
    setDragOverId(null);
    setDraggingNode(null);
  };

  // Add root node via modal
  const handleAddRootConfirm = (name: string) => {
    const newNode: TreeNode = {
      id: uuidv4(),
      name,
      children: [],
      hasChildren: false,
    };
    setTreeData((prev) => [...prev, newNode]);
    setShowAddRootModal(false);
  };

  return (
    <div className="tree-view-container">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4 className="mb-0 fw-bold text-dark">Tree View</h4>
        <button className="btn btn-primary btn-sm" onClick={() => setShowAddRootModal(true)}>
          + Add Root Node
        </button>
      </div>
      <div className="tree-view-content p-3 bg-white rounded shadow-sm">
        {treeData.length === 0 ? (
          <p className="text-muted text-center py-4">
            No nodes yet. Click "Add Root Node" to get started.
          </p>
        ) : (
          treeData.map((node) => (
            <TreeNodeItem
              key={node.id}
              node={node}
              depth={0}
              onToggle={handleToggle}
              onAdd={handleAdd}
              onRemove={handleRemoveRequest}
              onEdit={handleEdit}
              onDragStart={handleDragStart}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              dragOverId={dragOverId}
              draggingId={draggingNode?.id || null}
            />
          ))
        )}
      </div>

      {/* Add Root Node Modal */}
      <InputModal
        show={showAddRootModal}
        title="Add Root Node"
        placeholder="Enter root node name..."
        confirmLabel="Add Node"
        onConfirm={handleAddRootConfirm}
        onCancel={() => setShowAddRootModal(false)}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        show={deleteTarget !== null}
        title="Delete Node"
        message={`Are you sure you want to delete "${deleteTarget?.name}" and all its children?`}
        confirmLabel="Delete"
        confirmVariant="danger"
        onConfirm={handleRemoveConfirm}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
};

export default TreeView;
